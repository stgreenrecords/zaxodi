package portal.cms.pipeline.parsers.latest;


import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import portal.cms.pipeline.parsers.latest.beans.PropertyModel;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFormatException;
import javax.jcr.lock.LockException;
import javax.jcr.nodetype.ConstraintViolationException;
import javax.jcr.version.VersionException;
import javax.servlet.ServletException;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/pagegerenation/products")
})
public class ProductParser extends SlingAllMethodsServlet {

    @Reference
    private ResourceResolverFactory resolverFactory;

    private ResourceResolver resourceResolver;

    private PageManager pageManager;

    private PrintWriter printWriter;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            printWriter = response.getWriter();
            resourceResolver = resolverFactory.getAdministrativeResourceResolver(null);
            pageManager = resourceResolver.adaptTo(PageManager.class);
            System.out.println("\n\n\n\n\n\n\n               ================================Start========================================");
            Iterator<Resource> superCategoryIterator = resourceResolver.getResource("/content/catalogmodel").listChildren();
            while (superCategoryIterator.hasNext()) {
                Resource superCategoryResource = superCategoryIterator.next();
                Iterator<Resource> categoryIterator = superCategoryResource.listChildren();
                while (categoryIterator.hasNext()) {
                    Resource categoryResource = categoryIterator.next();
                    Iterator<Resource> productIterator = categoryResource.listChildren();
                    while (productIterator.hasNext()) {
                        Resource productResource = productIterator.next();
                        String pathToHTML = productResource.getValueMap().get("htmpPath", String.class);
                        String preBrand = pathToHTML.substring(0,pathToHTML.lastIndexOf("/"));
                        String brandFromPath = preBrand.substring(preBrand.lastIndexOf("/")+1,preBrand.length());
                        String productTitle = productResource.getValueMap().get("productTitle", String.class);
                        String productName = productResource.getValueMap().get("productName", String.class);
                        String microDescription = productResource.getValueMap().get("microdescription", String.class);
                        String imagePath = productResource.getValueMap().get("imagePath", String.class);
                        String convertedPath = categoryResource.getPath().replace("/content/catalogmodel", "/content/portal/catalog");
                        String repairTitle =  productTitle.toLowerCase().replaceAll("\\W|\\s|\\]|\\[|\\(|\\)|!|=|\\+|\\\\|/|[А-Я]|[а-я]|,|\\.|`|:|'|\"|&|#","-");
                        String fullPathFromJCR = convertedPath + "/" + brandFromPath+"/"+repairTitle;
                        Resource catalogResourceBrandFromJCR = resourceResolver.getResource(fullPathFromJCR);
                        if (catalogResourceBrandFromJCR != null){
                            System.out.println("skip " + fullPathFromJCR);
                            continue;
                        }
                        Document document = Jsoup.parse(getHTML(pathToHTML));
                        Element linkToBrand = document.select(".breadcrumbs__link").get(2);
                        String pathToMasterBrand = linkToBrand.attr("href");
                        String nameOfBrandFromMaster = pathToMasterBrand.substring(pathToMasterBrand.lastIndexOf("/") + 1, pathToMasterBrand.length());
                        String titleofBrandFromMaster = linkToBrand.text();
                           Resource catalogResourceBrand = resourceResolver.getResource(convertedPath + "/" + nameOfBrandFromMaster);
                        Page brandPage = null;
                        try {
                        if (catalogResourceBrand == null) {
                            brandPage = pageManager.create(convertedPath, nameOfBrandFromMaster, "/apps/portal/templates/catalogbrandtemplate", titleofBrandFromMaster);
                        } else {
                            brandPage = catalogResourceBrand.adaptTo(Page.class);
                        }

                        String pageName = brandPage.getPath() + "/" + repairTitle;
                        Page productPage = null;
                        if (resourceResolver.getResource(pageName) == null){
                            productPage = pageManager.create(brandPage.getPath(), repairTitle, "/apps/portal/templates/catalogproducttemplate", productTitle);
                        }
                        else continue;
                            System.out.print("PARSE PRODUCT: " + categoryResource.getName() + "     " + brandPage.getTitle() + " " +productPage.getTitle()+"        ");
                        Elements listOfProperties = document.select(".product-specs__table tbody");
                        List<String> propertyListNotJoin = new ArrayList<>();
                        Node productNode = productPage.getContentResource().adaptTo(Node.class);
                        productNode.setProperty("microdescription", microDescription);
                        List<String> propertyModels = new ArrayList<>();

                            listOfProperties.forEach(propertyGroup -> {
                                String filterGroupName = propertyGroup.select(".product-specs__table-title-inner").first().text();
                                propertyGroup.select("tr:not(.product-specs__table-title)").forEach(propertyItem -> {
                                    String propertyName = propertyItem.select(".product-tip__term").first().text();
                                    Elements simpleValue = propertyItem.select("td .value__text");
                                    Elements booleanNO = propertyItem.select("td .i-x");
                                    Elements booleanYES = propertyItem.select(".i-tip");
                                    String rawPropertyValue = simpleValue.size() == 0 ? booleanNO.size() == 0 ? booleanYES.text() : booleanNO.text() : simpleValue.text();
                                    String propertyValue = "";
                                    String propertyUnits = "";
                                    String propertyType = null;
                                    if ((booleanNO.size() > 0 || booleanYES.size() > 0)) {
                                        propertyType = "numberBoolean";
                                        if (booleanNO.size() > 0) {
                                            propertyValue = "Off";
                                        } else {
                                            String stringCount = simpleValue.text();
                                            int countRes = 1;
                                            if (StringUtils.isNumeric(stringCount)) {
                                                int count = Integer.parseInt(stringCount);
                                                countRes = count;
                                                propertyValue = "true," + count;
                                            } else {
                                                propertyValue = "true,1";
                                            }
                                            try {
                                                productNode.setProperty(encodeName(propertyName) + "H", "true");
                                                productNode.setProperty(encodeName(propertyName) + "W", String.valueOf(countRes));
                                            } catch (RepositoryException e) {
                                                e.printStackTrace();
                                            }
                                        }
                                    }
                                    if (rawPropertyValue.split("\\u002C ").length > 1 && propertyType ==null) {
                                        propertyValue = rawPropertyValue.replaceAll("\\u002C ", ",");
                                        try {
                                            productNode.setProperty(encodeName(propertyName), propertyValue.split(","));
                                        } catch (RepositoryException e) {
                                            e.printStackTrace();
                                        }
                                        propertyType = "enum";
                                    }
                                    if (rawPropertyValue.contains(" x ") && propertyType ==null) {
                                        propertyType = "size";
                                        String[] sizeArray = rawPropertyValue.split("\\s|\\u00A0");
                                        Number firstValue = null;
                                        Number secondValue = null;
                                        if (sizeArray[0].contains(".")) {
                                            firstValue = Double.parseDouble(sizeArray[0]);
                                        } else {
                                            firstValue = ((Double) Double.parseDouble(sizeArray[0])).intValue();
                                        }
                                        if (sizeArray[2].contains(".")) {
                                            secondValue = Double.parseDouble(sizeArray[2]);
                                        } else {
                                            secondValue = ((Double) Double.parseDouble(sizeArray[2])).intValue();
                                        }
                                        if (sizeArray.length == 4) {
                                            propertyUnits = sizeArray[3];
                                        }
                                        try {
                                            productNode.setProperty(encodeName(propertyName) + "H", firstValue.toString());
                                            productNode.setProperty(encodeName(propertyName) + "W", secondValue.toString());
                                        } catch (RepositoryException e) {
                                            e.printStackTrace();
                                        }
                                        propertyValue = firstValue + "," + secondValue;
                                    }
                                    if (rawPropertyValue.split(" \\u2014 ").length > 1 && propertyType ==null) {
                                        String[] sizeArray = rawPropertyValue.split("\\s|\\u00A0");
                                        Number firstValue = null;
                                        Number secondValue = null;
                                        try {
                                            if (sizeArray[0].contains(".")) {
                                                firstValue = Double.parseDouble(sizeArray[0]);
                                            } else {
                                                firstValue = ((Double) Double.parseDouble(sizeArray[0])).intValue();
                                            }
                                            if (sizeArray[2].contains(".")) {
                                                secondValue = Double.parseDouble(sizeArray[2]);
                                            } else {
                                                secondValue = ((Double) Double.parseDouble(sizeArray[2])).intValue();
                                            }
                                            if (sizeArray.length == 4) {
                                                propertyUnits = sizeArray[3];
                                            }
                                        } catch (NumberFormatException e) {
                                            propertyType = null;
                                        }
                                        try {
                                            if (propertyType != null){
                                                productNode.setProperty(encodeName(propertyName) + "H", firstValue.toString());
                                                productNode.setProperty(encodeName(propertyName) + "W", secondValue.toString());
                                            }
                                        } catch (RepositoryException e) {
                                            e.printStackTrace();
                                        }
                                        propertyValue = firstValue + "," + secondValue;
                                        propertyType = "interval";
                                    }
                                    if (rawPropertyValue.split("[+-]?([0-9]*[.])?[0-9]+/[+-]?([0-9]*[.])?[0-9]+").length > 1 && propertyType ==null) {
                                        String[] mainSplit = rawPropertyValue.split("\\s|\\u00A0");
                                        String[] sizeArray = mainSplit[0].split("/");
                                        Number firstValue = null;
                                        Number secondValue = null;
                                        if (sizeArray[0].contains(".")) {
                                            firstValue = Double.parseDouble(sizeArray[0]);
                                        } else {
                                            firstValue = ((Double) Double.parseDouble(sizeArray[0])).intValue();
                                        }
                                        try {
                                            productNode.setProperty(encodeName(propertyName) + "H", firstValue.toString());
                                        } catch (RepositoryException e) {
                                            e.printStackTrace();
                                        }
                                        String pattern = "[+-]?([0-9]*[.])?[0-9]+";
                                        Pattern floatPattern = Pattern.compile(pattern);
                                        Matcher matcher = floatPattern.matcher(sizeArray[1]);
                                        matcher.find();
                                        String cleanSecondValue = matcher.group(0);
                                        if (cleanSecondValue.contains(".")) {
                                            secondValue = Double.parseDouble(cleanSecondValue);
                                        } else {
                                            secondValue = ((Double) Double.parseDouble(cleanSecondValue)).intValue();
                                        }
                                        if (mainSplit.length == 2) {
                                            propertyUnits = mainSplit[1];
                                        }
                                        try {
                                            productNode.setProperty(encodeName(propertyName) + "W", secondValue.toString());
                                        } catch (RepositoryException e) {
                                            e.printStackTrace();
                                        }
                                        propertyValue = firstValue + "," + secondValue;
                                        propertyType = "attitude";
                                    }
                                    if (StringUtils.isEmpty(propertyType) && StringUtils.isNotEmpty(rawPropertyValue) && (booleanYES.size() == 0 && booleanNO.size() == 0)) {
                                        String pattern = "[+-]?([0-9]*[.])?[0-9]+";
                                        Pattern floatPattern = Pattern.compile(pattern);
                                        Matcher matcher = floatPattern.matcher(rawPropertyValue);
                                        if (matcher.find()) {
                                            propertyType = "float";
                                            String[] floatArray = rawPropertyValue.split("\\s|\\u00A0");
                                            StringBuilder stringBuilder = new StringBuilder();
                                            if (floatArray.length > 2) {
                                                if (StringUtils.isNumeric(floatArray[floatArray.length - 1])) {
                                                    for (int i = 0; i < floatArray.length; i++) {
                                                        stringBuilder.append(floatArray[i]);
                                                    }
                                                    propertyValue = stringBuilder.toString();
                                                } else {
                                                    for (int i = 0; i < floatArray.length - 1; i++) {
                                                        stringBuilder.append(floatArray[i]);
                                                    }
                                                    propertyUnits = floatArray[floatArray.length - 1];
                                                    propertyValue = stringBuilder.toString();
                                                }

                                            } else {
                                                propertyValue = floatArray[0];
                                                if (floatArray.length > 1) {
                                                    propertyUnits = floatArray[1];
                                                }
                                            }
                                            try {
                                                productNode.setProperty(encodeName(propertyName), propertyValue);
                                            } catch (RepositoryException e) {
                                                e.printStackTrace();
                                            }
                                        } else {
                                            propertyType = "simpletext";
                                            propertyValue = rawPropertyValue;
                                            try {
                                                productNode.setProperty(encodeName(propertyName), propertyValue);
                                            } catch (RepositoryException e) {
                                                e.printStackTrace();
                                            }
                                        }
                                    }
                                    if (propertyUnits.length() > 0 && propertyUnits.charAt(propertyUnits.length() - 1) == '.') {
                                        propertyUnits = propertyUnits.substring(0, propertyUnits.length() - 1);
                                    }
                                    if (propertyUnits.equals("''")) {
                                        propertyUnits = "";
                                    }
                                    if (StringUtils.isNotEmpty(propertyName) && StringUtils.isNotEmpty(propertyType) && StringUtils.isNotEmpty(propertyValue)){
                                        String propertyResultItem = "{" +
                                                "'name':'" + propertyName + "'," +
                                                "'value':'" + propertyValue + "'," +
                                                "'type':'" + propertyType + "'," +
                                                "'units':'" + propertyUnits + "'," +
                                                "'group':'" + filterGroupName + "','exclude':'false'}";
                                        propertyListNotJoin.add(propertyResultItem);
                                        propertyModels.add("{\"typeSelection\":\"" + propertyType + "\",\"valueSelection\":\"" + propertyName + "\",\"units\":\"" + propertyUnits + "\",\"group\":\"" +
                                                filterGroupName + "\",\"exclude\":[],\"microdescription\":[]}");
                                    }
                                });
                            });
                            productPage.getParent().getParent().getContentResource().adaptTo(Node.class).setProperty("properties", propertyModels.toArray(new String[]{}));
                            String propertyListJoin = propertyListNotJoin.stream()
                                    .map(i -> i.toString())
                                    .collect(Collectors.joining(","));
                            productNode.setProperty("results", "[" + propertyListJoin + "]");

                            Node imageNode = productNode.addNode("image");
                            imageNode.setProperty("fileReference", uploadImage(brandPage.getPath().replace("/content/portal", "/content/dam/portal"), imagePath, productPage.getName()));
                            resourceResolver.commit();
                            System.out.println("FINISH : " + brandPage.getTitle() + " " +productPage.getTitle());
                            Thread.sleep(400);
                        } catch (RepositoryException e) {
                            System.out.println(e.getMessage());
                        } catch (IOException e) {
                            System.out.println(e.getMessage());
                        } catch (InterruptedException e) {
                            System.out.println(e.getMessage());
                        } catch (WCMException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }

        } catch (LoginException e) {
            e.printStackTrace();
        }
    }

    private String encodeName(String name) {
        try {
            return URLEncoder.encode(name, "UTF-8").
                    replace("+", "%20").
                    replace("%28", "(").
                    replace("%29", ")").
                    replace("%2C", ",").
                    replace("%21", "!").
                    replace("%27", "'").replace("%", "");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return "";
    }

    private String getHTML(String url) {
        URL obj = null;
        StringBuilder response = null;
        try {
            obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("GET");
            InputStreamReader inputStreamReader = new InputStreamReader(con.getInputStream(), "UTF-8");
            BufferedReader in = new BufferedReader(inputStreamReader);
            String inputLine;
            response = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response.toString();
    }

    private String uploadImage(String pathToCategoryDam, String imageURL, String folderName) throws IOException, RepositoryException {
        String pathToImageFolder = pathToCategoryDam;
        Resource damResource = resourceResolver.getResource(pathToImageFolder);
        if (damResource == null){
            damResource = recurciveCreate(pathToImageFolder);
        }
        Node categoryNode = damResource.adaptTo(Node.class);
        Node imageFolderNode = categoryNode.addNode(folderName);
        imageFolderNode.setPrimaryType("sling:OrderedFolder");

        AssetManager assetMgr = resourceResolver.adaptTo(com.day.cq.dam.api.AssetManager.class);
        resourceResolver.adaptTo(Session.class).save();
        Asset asset = assetMgr.createAsset(imageFolderNode.getPath() + "/productimage.jpg", sendRequest(imageURL), "image/jpeg", true);
        return asset.getPath();
    }

    private Resource recurciveCreate(String pathToImageFolder) {
        String[] splitedPath = pathToImageFolder.substring(1,pathToImageFolder.length()).split("/");
        String startResource = "";
        Resource lastFoundResource = null;
        for (String pathItem : splitedPath){
            startResource = startResource + "/" + pathItem;
            Resource resourceToCheck = resourceResolver.getResource(startResource);
            if (resourceToCheck != null){
                lastFoundResource = resourceToCheck;
            } else {
                Node lastFoundNode = lastFoundResource.adaptTo(Node.class);
                try {
                    Node newNode = lastFoundNode.addNode(pathItem);
                    newNode.setPrimaryType("sling:OrderedFolder");
                    resourceResolver.adaptTo(Session.class).save();
                    lastFoundResource = resourceResolver.getResource(newNode.getPath());
                } catch (RepositoryException e) {
                    e.printStackTrace();
                }
            }
        }
        return lastFoundResource;
    }

    private InputStream sendRequest(String url) throws IOException {
        URL obj = null;
        url = url.substring(1,url.length());
        url = url.substring(0,url.length()-1);
        obj = new URL("http:" + url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("GET");
        return con.getInputStream();
    }


}
