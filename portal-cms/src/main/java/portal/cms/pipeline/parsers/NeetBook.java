package portal.cms.pipeline.parsers;

import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/fillcatalog/neetbook")
})
public class NeetBook extends SlingAllMethodsServlet {

    private Session cqSession;
    private ResourceResolver resourceResolver;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException, ServletException {
        resourceResolver = request.getResourceResolver();
        cqSession = resourceResolver.adaptTo(Session.class);
        try {
            fillCatalogFromFile();
        } catch (RepositoryException e) {
        }
    }

    private void fillCatalogFromFile() throws IOException, RepositoryException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream("e:/json.txt"), "UTF-8"));

        StringBuilder fileContent = new StringBuilder();
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            fileContent.append(line);
        }
        JsonParser jsonParser = new JsonParser();
        JsonElement rootElement = jsonParser.parse(fileContent.toString());
        JsonArray jsonArray = rootElement.getAsJsonObject().get("products").getAsJsonArray();

        Node nodeForCopy = cqSession.getNode("/content/portal/catalog/computers-and-network/notebook/msi-gt80s-6qe-053ru-titan-sli-heroes-special-edition");
        Node parentNode = nodeForCopy.getParent();

        for (JsonElement jsonElement : jsonArray) {
            try {


                JsonObject jsonObject = jsonElement.getAsJsonObject();
                String imageURL = jsonObject.get("images").getAsJsonObject().get("header").getAsString().replace("//", "");
                String nameForNewNode = jsonObject.get("full_name").getAsString().replaceAll(" ", "-").toLowerCase().replaceAll("\\[", "").replaceAll("\\]", "");
                String brand = jsonObject.get("full_name").getAsString().split(" ")[0];
                String model = jsonObject.get("name").getAsString();
                String description = jsonObject.get("description").getAsString();
                String diagonal = description.substring(0, description.indexOf("\"") == -1 ? description.indexOf("&quot") : description.indexOf("\""));
                String[] monitorProperties = description.substring(description.indexOf(" ") + 1, description.indexOf(",")).split(" ");
                String firstResolutionParameter = monitorProperties[0];
                String secondResolutionParameter = monitorProperties[2];
                String monitorType = monitorProperties.length > 3 ? monitorProperties[3] : "";
                String[] globalDescriptionArray = description.split(", ");
                String[] processorArray = globalDescriptionArray[1].split(" ").length > 1 ? globalDescriptionArray[1].split(" ") : globalDescriptionArray[2].split(" ");
                String processorName = processorArray[processorArray.length - 3];
                String processorAmplitude = processorArray[processorArray.length - 2];
                int countWordOfProcessorName = processorArray.length - 3;
                StringBuilder procNameBuilder = new StringBuilder();
                for (int j = 0; j < countWordOfProcessorName; j++) {
                    procNameBuilder.append(processorArray[j] + " ");
                }
                String processorBrand = procNameBuilder.toString().substring(0, procNameBuilder.toString().length() - 1);
                String ramVolume = globalDescriptionArray[2].split(" ")[0];
                String hdd = "";
                String ssd = "";
                String hddType = "";
                if (description.contains("HDD + SSD")) {
                    hddType = "HDD + SSD";
                    hdd = globalDescriptionArray[3].split(" ")[0];
                    ssd = globalDescriptionArray[3].split(" ")[3];
                } else {
                    hdd = globalDescriptionArray[3].split(" ")[0];
                    hddType = "HDD";
                }
                String colorComputer = "-";
                String graphicAdapter = "-";
                String osSystem = "-";
                String colorUp = "-";
                if (globalDescriptionArray[globalDescriptionArray.length - 1].contains("цвет корпуса")) {
                    colorComputer = globalDescriptionArray[globalDescriptionArray.length - 1].split(" ")[2];
                    graphicAdapter = globalDescriptionArray[globalDescriptionArray.length - 4];
                    osSystem = globalDescriptionArray[globalDescriptionArray.length - 3];
                    colorUp = globalDescriptionArray[globalDescriptionArray.length - 2].split(" ")[2];
                } else {
                    graphicAdapter = globalDescriptionArray[globalDescriptionArray.length - 3];
                    osSystem = globalDescriptionArray[globalDescriptionArray.length - 2];
                    colorUp = globalDescriptionArray[globalDescriptionArray.length - 1].split(" ")[2];
                }
                if (!parentNode.hasNode(nameForNewNode)) {
                    Node currentCopedNode = JcrUtil.copy(nodeForCopy, parentNode, nameForNewNode);
                    Node jcrContentNode = currentCopedNode.getNode("jcr:content");
                    jcrContentNode.setProperty("jcr:title", jsonObject.get("full_name").getAsString());
                    Node contentNode = currentCopedNode.getNode("jcr:content/content_container/section/section-par/catalogItemInfo");
                    String ssdResultProperty = "";
                    if (!ssd.equals("")) {
                        ssdResultProperty = "{'propertyName':'Емкость SSD','propertyValue':'" +
                                ssd +
                                "','propertyType':'number','units':'ГБ'},";
                    }
                    contentNode.setProperty("results", "[{'propertyName':'Марка(Бренд)','propertyValue':'" + brand + "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Модель','propertyValue':'" + model + "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Диагональ экрана','propertyValue':'" + diagonal + "','propertyType':'float','units':''}," +
                            "{'propertyName':'Разрешение экрана','propertyValue':'" + firstResolutionParameter + "," + secondResolutionParameter + "','propertyType':'size','units':''}," +
                            "{'propertyName':'Поверхность экрана','propertyValue':'" + monitorType + "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Процессор','propertyValue':'" + processorBrand + "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Модель процессора','propertyValue':'" + processorName + "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Тактовая частота','propertyValue':'" +
                            processorAmplitude +
                            "','propertyType':'number','units':'МГц'}," +
                            "{'propertyName':'Объём оперативной памяти','propertyValue':'" +
                            ramVolume +
                            "','propertyType':'float','units':'ГБ'}," +
                            "{'propertyName':'Тип жесткого диска (дисков)','propertyValue':'" +
                            hddType +
                            "','propertyType':'simpletext','units':''}," +
                            ssdResultProperty +
                            "{'propertyName':'Ёмкость жесткого диска','propertyValue':'" +
                            hdd +
                            "','propertyType':'number','units':'ГБ'}," +
                            "{'propertyName':'Графический адаптер','propertyValue':'" +
                            graphicAdapter +
                            "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Операционная система','propertyValue':'" +
                            osSystem +
                            "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'Цвет корпуса','propertyValue':'" +
                            colorComputer +
                            "','propertyType':'simpletext','units':''}," +
                            "{'propertyName':'" +
                            "Цвет крышки" +
                            "','propertyValue':'" +
                            colorUp +
                            "','propertyType':'simpletext','units':''}]");
                    Node imageNode = contentNode.getNode("image");
                    String pathToImageFolder = "/content/dam/portal/catalog/computers-and-network/notebook";
                    imageNode.setProperty("fileReference", pathToImageFolder + "/" + nameForNewNode + "/productimage.jpg");
                    contentNode.setProperty("D081D0BCD0BAD0BED181D182D18C20D0B6D0B5D181D182D0BAD0BED0B3D0BE20D0B4D0B8D181D0BAD0B0", hdd);
                    contentNode.setProperty("D093D180D0B0D184D0B8D187D0B5D181D0BAD0B8D0B920D0B0D0B4D0B0D0BFD182D0B5D180", graphicAdapter);
                    contentNode.setProperty("D094D0B8D0B0D0B3D0BED0BDD0B0D0BBD18C20D18DD0BAD180D0B0D0BDD0B0", diagonal);
                    contentNode.setProperty("D095D0BCD0BAD0BED181D182D18C20SSD", ssd);
                    contentNode.setProperty("D09CD0BED0B4D0B5D0BBD18C20D0BFD180D0BED186D0B5D181D181D0BED180D0B0", processorName);
                    contentNode.setProperty("D09ED0B1D18AD191D0BC20D0BED0BFD0B5D180D0B0D182D0B8D0B2D0BDD0BED0B920D0BFD0B0D0BCD18FD182D0B8", ramVolume);
                    contentNode.setProperty("D09ED0BFD0B5D180D0B0D186D0B8D0BED0BDD0BDD0B0D18F20D181D0B8D181D182D0B5D0BCD0B0", osSystem);
                    contentNode.setProperty("D09FD0BED0B2D0B5D180D185D0BDD0BED181D182D18C20D18DD0BAD180D0B0D0BDD0B0", monitorType);
                    contentNode.setProperty("D09FD180D0BED186D0B5D181D181D0BED180", processorBrand);
                    contentNode.setProperty("D0A0D0B0D0B7D180D0B5D188D0B5D0BDD0B8D0B520D18DD0BAD180D0B0D0BDD0B0H", firstResolutionParameter);
                    contentNode.setProperty("D0A0D0B0D0B7D180D0B5D188D0B5D0BDD0B8D0B520D18DD0BAD180D0B0D0BDD0B0W", secondResolutionParameter);
                    contentNode.setProperty("D0A2D0B0D0BAD182D0BED0B2D0B0D18F20D187D0B0D181D182D0BED182D0B0", processorAmplitude);
                    contentNode.setProperty("D0A2D0B8D0BF20D0B6D0B5D181D182D0BAD0BED0B3D0BE20D0B4D0B8D181D0BAD0B020(D0B4D0B8D181D0BAD0BED0B2)", hddType);
                    contentNode.setProperty("D0A6D0B2D0B5D18220D0BAD0BED180D0BFD183D181D0B0", colorComputer);
                    contentNode.setProperty("D0A6D0B2D0B5D18220D0BAD180D18BD188D0BAD0B8", colorUp);
                    contentNode.setProperty("brand", brand);
                    contentNode.setProperty("model", model);

                    uploadImage(imageURL, nameForNewNode);

                    cqSession.save();
                }
            } catch (Exception e) {

            }
        }
    }

    private void uploadImage(String imageURL, String folderName) throws IOException, RepositoryException {
        String pathToImageFolder = "/content/dam/portal/catalog/computers-and-network/notebook";
        Node categoryNode = cqSession.getNode(pathToImageFolder);
        Node imageFolderNode = categoryNode.addNode(folderName);
        imageFolderNode.setPrimaryType("sling:OrderedFolder");
        AssetManager assetMgr = resourceResolver.adaptTo(com.day.cq.dam.api.AssetManager.class);
        Asset asset = assetMgr.createAsset(pathToImageFolder + "/" + folderName + "/productimage.jpg", sendRequest(imageURL), "image/jpeg", true);
    }

    private InputStream sendRequest(String url) throws IOException {
        StringBuilder response = null;
        URL obj = null;
        obj = new URL("http://" + url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("GET");
        return con.getInputStream();
    }

}
