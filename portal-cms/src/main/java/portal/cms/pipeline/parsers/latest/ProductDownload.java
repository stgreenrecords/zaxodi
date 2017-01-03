package portal.cms.pipeline.parsers.latest;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.gson.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import portal.cms.pipeline.parsers.latest.beans.ProductItems;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/pagegerenation/productsdownload")
})
public class ProductDownload extends SlingAllMethodsServlet {

    @Reference
    private ResourceResolverFactory resolverFactory;

    private ResourceResolver resourceResolver;

    private PageManager pageManager;

    private PrintWriter printWriter;


    String onlinerRequest = "https://catalog.api.onliner.by/search/desktoppc?group=1&page=3";

    Map<String, Set<ProductItems>> mainMap = new LinkedHashMap<>();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            resourceResolver = resolverFactory.getAdministrativeResourceResolver(null);
            pageManager = resourceResolver.adaptTo(PageManager.class);
            Session session = resourceResolver.adaptTo(Session.class);
            Node contentNode = session.getNode("/content");
            Node catalogModelNode = contentNode.addNode("catalogmodel");
            Page rootPage = pageManager.getPage("/content/portal/catalog");
            printWriter = response.getWriter();
            System.out.println("=======================START=================");
            Iterator<Page> superCategoriesIterator = rootPage.listChildren();
            int totalCount = 0;
            while (superCategoriesIterator.hasNext()) {
                Page superCategoryPage = superCategoriesIterator.next();
                System.out.println("                                                         SUPER CATEGORY: " + superCategoryPage.getTitle());
                Iterator<Page> categoriesIterator = superCategoryPage.listChildren();
                Node superCategoryNode = catalogModelNode.addNode(superCategoryPage.getName());
                while (categoriesIterator.hasNext()) {
                    Page categoryPage = categoriesIterator.next();
                    System.out.print("        Category: " + categoryPage.getTitle());
//printWriter.write(categoryPage.getPath()+"\n");
                    Set<ProductItems> productItems = getDataFromCategory(categoryPage.getName());
                    if (productItems != null && productItems.size() > 0) {
                        System.out.println(". Продуктов в категории: " + productItems.size()+"    ");
                        totalCount += productItems.size();
                        Node categoryNode = superCategoryNode.addNode(categoryPage.getName());
                        int trashhold = 0;
                        for (ProductItems product : productItems){
                            Node productNode = categoryNode.addNode(UUID.randomUUID().toString());
                            productNode.setProperty("imagePath",product.getImagePath());
                            productNode.setProperty("microdescription",product.getMicroDescription());
                            productNode.setProperty("htmpPath",product.getPathToProduct());
                            productNode.setProperty("productTitle",product.getProductTitle());
                            productNode.setProperty("productName", product.getProductName());
                            trashhold++;
                            if (trashhold > 200){
                                System.out.println("Save 200 nodes");
                                session.save();
                                trashhold = 0;
                            }

                        }
                        session.save();
                        mainMap.put(categoryPage.getName(), productItems);

                        //        productItems.forEach((product) -> printWriter.write(product.toString()));
                        // printWriter.write(categoryPage.getPath() + "\r\n");
                    }
                    System.out.println("");
                    Thread.sleep(1000);
                }
                session.save();
            }
            System.out.println("Всего" + totalCount + " продуктов");
        } catch (LoginException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (PathNotFoundException e) {
            e.printStackTrace();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }
    }

    private Set<ProductItems> getDataFromCategory(String categoryName) {
        Set<ProductItems> productItems = new LinkedHashSet<>();
        try {
            StringBuilder response = null;
            JsonParser jsonParser = new JsonParser();
            for (int i = 1; i < 120; i++) {
                URL obj = null;
                obj = new URL("https://catalog.api.onliner.by/search/" + categoryName + "?group=1&page=" + i);
                HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                con.setRequestMethod("GET");
                InputStreamReader inputStreamReader = new InputStreamReader(con.getInputStream(), "UTF-8");
                BufferedReader in = new BufferedReader(inputStreamReader);
                String inputLine;
                response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                JsonObject parser = null;
                try {
                    parser = jsonParser.parse(response.toString()).getAsJsonObject();
                } catch (JsonSyntaxException e) {
                    //     System.out.println("================================PARSE ERROR=========================");
                    //      System.out.println(response.toString());
                    //     System.out.println("================================PARSE ERROR=========================");
                }
                try {
                    if (parser != null && parser.has("products")) {
                        JsonArray jsonArray = null;
                        try {
                            jsonArray = parser.get("products").getAsJsonArray();
                        } catch (Exception e) {
                            //       System.out.println("================================PARSE ERROR=========================");
                        }
                        // System.out.print("Page "+i+"______ ");
                        //    System.out.print("Number of products: "+ jsonArray.size());
                        if (jsonArray.size() == 0) break;
                        //   System.out.print(" ==========");
                        for (JsonElement jsonElement : jsonArray) {
                            JsonObject jsonObject = null;
                            try {
                                jsonObject = jsonElement.getAsJsonObject();
                            } catch (Exception e) {
                                //        System.out.println("================================PARSE ERROR=========================");
                            }
                            String productPath = null;
                            try {
                                productPath = jsonObject.has("html_url") ? jsonObject.get("html_url").getAsString() : null;
                            } catch (Exception e) {
                                //          System.out.println("================================PARSE ERROR=========================");
                            }

                            String productTitle = null;
                            try {
                                productTitle = jsonObject.has("name") ? jsonObject.get("name").getAsString() : null;
                            } catch (Exception e) {
                                //          System.out.println("================================PARSE ERROR=========================");
                            }
                            String productName = null;
                            try {
                                productName = jsonObject.has("key") ? jsonObject.get("key").getAsString() : null;
                            } catch (Exception e) {
                                //          System.out.println("================================PARSE ERROR=========================");
                            }

                            String microdescription = null;
                            try {
                                microdescription = jsonObject.has("description") ? jsonObject.get("description").getAsString() : null;
                            } catch (Exception e) {
                                //         System.out.println("================================PARSE ERROR=========================");
                            }
                            String imagePhotoUrl = null;
                            try {
                                JsonObject imageObject = jsonObject.has("images") ? jsonObject.get("images").getAsJsonObject() : null;
                                imagePhotoUrl = imageObject.get("header").toString();
                                if (imagePhotoUrl.equals("null")){
                                    imagePhotoUrl = imageObject.get("icon").toString();
                                }
                            } catch (Exception e) {
                                //       System.out.println("================================PARSE ERROR=========================");
                            }
                            if (jsonObject.has("children")) {
                                for (JsonElement jsonElement1 : jsonObject.get("children").getAsJsonArray()) {
                                    JsonObject jsonObject1 = null;
                                    try {
                                        jsonObject1 = jsonElement1.getAsJsonObject();
                                    } catch (Exception e) {
                                        //       System.out.println("================================PARSE ERROR=========================");
                                    }
                                    String productPath1 = null;
                                    try {
                                        productPath1 = jsonObject1.has("html_url") ? jsonObject1.get("html_url").getAsString() : null;
                                    } catch (Exception e) {
                                        //         System.out.println("================================PARSE ERROR=========================");
                                    }
                                    String productTitle1 = null;
                                    try {
                                        productTitle1 = jsonObject1.has("name") ? jsonObject1.get("name").getAsString() : null;
                                    } catch (Exception e) {
                                        //          System.out.println("================================PARSE ERROR=========================");
                                    }
                                    String productName1 = null;
                                    try {
                                        productName1 = jsonObject1.has("key") ? jsonObject1.get("key").getAsString() : null;
                                    } catch (Exception e) {
                                        //          System.out.println("================================PARSE ERROR=========================");
                                    }
                                    String microdescription1 = null;
                                    try {
                                        microdescription1 = jsonObject1.has("description") ? jsonObject1.get("description").getAsString() : null;
                                    } catch (Exception e) {
                                        //      System.out.println("================================PARSE ERROR=========================");
                                    }
                                    String imagePhotoUrl1 = null;
                                    try {
                                        JsonObject imageObject1 = jsonObject1.has("images") ? jsonObject1.get("images").getAsJsonObject() : null;
                                        imagePhotoUrl1 = imageObject1.get("header").toString();
                                        if (imagePhotoUrl1.equals("null")){
                                            imagePhotoUrl1 = imageObject1.get("icon").toString();
                                        }
                                    } catch (Exception e) {
                                        //      System.out.println("================================PARSE ERROR=========================");
                                    }
                                    if (StringUtils.isNotEmpty(imagePhotoUrl1) && StringUtils.isNotEmpty(microdescription1) && StringUtils.isNotEmpty(productPath1)) {
                                        productItems.add(new ProductItems(imagePhotoUrl1, microdescription1, productPath1, productName1,productTitle1));
                                    }
                                }
                            }
                            if (StringUtils.isNotEmpty(imagePhotoUrl) && StringUtils.isNotEmpty(microdescription) && StringUtils.isNotEmpty(productPath)) {
                                productItems.add(new ProductItems(imagePhotoUrl, microdescription, productPath, productName,productTitle));
                            }
                        }
                    }
                } catch (Exception e) {
                    // e.printStackTrace();
                }
                Thread.sleep(900);
            }
            return productItems;
        } catch (Exception e) {
            return productItems;
        }
    }


}
