package portal.cms.pipeline;

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
import java.util.Arrays;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/fillcatalog")
})
public class UploadFromExternalResource extends SlingAllMethodsServlet {

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
          JsonArray jsonArray = sendOnlinerRequests(55);

          Node nodeForCopy = cqSession.getNode("/content/portal/catalog/electronics/phones/apple-iphone-5s-16gb-space-gray");
          Node parentNode = nodeForCopy.getParent();

          for (JsonElement jsonElement : jsonArray) {
              try {


                  JsonObject jsonObject = jsonElement.getAsJsonObject();
                  String imageURL = jsonObject.get("images").getAsJsonObject().get("header").getAsString().replace("//", "");
                  String nameForNewNode = jsonObject.get("full_name").getAsString().replaceAll(" ", "-").toLowerCase().replaceAll("\\[", "").replaceAll("\\]", "");
                  String brand = jsonObject.get("full_name").getAsString().split(" ")[0];
                  String model = jsonObject.get("name").getAsString();
                  String description = jsonObject.get("description").getAsString().replaceAll("&nbsp;"," ").replaceAll("&quot;","\"");
                  String[] globalDescriptionArray = description.split(", ");
                  String os = globalDescriptionArray[0];
                  String screenSize = globalDescriptionArray[1].split(" ")[1].replace("\"","");
                  String screenTexnology = globalDescriptionArray[1].split(" ")[2];
                  String firstResolutionParameter = globalDescriptionArray[1].split(" ")[3].replace("(","").replace(")","").split("x")[0];
                  String secondResolutionParameter = globalDescriptionArray[1].split(" ")[3].replace("(","").replace(")","").split("x")[1];
                  String ram = globalDescriptionArray[2].split(" ")[1];
                  String hdd = globalDescriptionArray[3].split(" ")[1];
                  String cameraExist = "true";
                  String cameraCount = "1";
                  String cameraSize = "";
                  String sdCard = "";
                  String sdCount = "1";
                  String battery = "";
                  String dualSim = "";
                  String dualSimCount = "1";
                  if (globalDescriptionArray[4].contains("карты памяти")){
                      sdCard = "true";
                      cameraSize = globalDescriptionArray[5].split(" ")[1];
                      battery = globalDescriptionArray[6].split(" ")[1];
                      if (globalDescriptionArray[7].contains("Dual SIM")){
                          dualSim = "true";
                      }

                  } else {
                      cameraSize = globalDescriptionArray[4].split(" ")[1];
                      battery = globalDescriptionArray[5].split(" ")[1];
                      if (globalDescriptionArray[6].contains("Dual SIM")){
                          dualSim = "true";
                      }
                  }
                  String color[] = globalDescriptionArray[globalDescriptionArray.length-1].split(" ")[1].split("/");

                  System.out.println(description);

                  if (!parentNode.hasNode(nameForNewNode)) {
                      System.out.println(nameForNewNode);
                      Node currentCopedNode = JcrUtil.copy(nodeForCopy, parentNode, nameForNewNode);
                      Node jcrContentNode = currentCopedNode.getNode("jcr:content");
                      jcrContentNode.setProperty("jcr:title", jsonObject.get("full_name").getAsString());
                      Node contentNode = currentCopedNode.getNode("jcr:content/content_container/section/section-par/catalogItemInfo");

                      contentNode.setProperty("results", "[{'propertyName':'Марка(Бренд)','propertyValue':'" +
                              brand +
                              "','propertyType':'simpletext','units':''},{'propertyName':'Модель','propertyValue':'" +
                              model +
                              "','propertyType':'simpletext','units':''},{'propertyName':'Операционная система','propertyValue':'" +
                              os +
                              "','propertyType':'simpletext','units':''},{'propertyName':'Размер экрана','propertyValue':'" +
                              screenSize +
                              "','propertyType':'number','units':''},{'propertyName':'Технология экрана','propertyValue':'" +
                              screenTexnology +
                              "','propertyType':'simpletext','units':''},{'propertyName':'Разрешение экрана','propertyValue':'" +
                              firstResolutionParameter+","+secondResolutionParameter +
                              "','propertyType':'size','units':''},{'propertyName':'Оперативная память','propertyValue':'" +
                              ram +
                              "','propertyType':'float','units':'ГБ'},{'propertyName':'Флэш-память','propertyValue':'" +
                              hdd +
                              "','propertyType':'float','units':'ГБ'},{'propertyName':'Встроенная камера','propertyValue':'true,1','propertyType':'numberBoolean','units':''},{'propertyName':'Количество точек матрицы','propertyValue':'" +
                              cameraSize +
                              "','propertyType':'float','units':'Мп'},{'propertyName':'Ёмкость аккумулятора','propertyValue':'" +
                              battery +
                              "','propertyType':'number','units':'мА·ч'},{'propertyName':'" +
                              "Цвет корпуса','propertyValue':'" +
                              Arrays.toString(color).replace("[","").replace("]","").replaceAll(" ","") +
                              "','propertyType':'enum','units':''},{'propertyName':'Поддержка нескольких SIM-карт','propertyValue':'" +
                              (dualSim.equals("") ? "Off" : "true,1" )+
                              "','propertyType':'numberBoolean','units':''},{'propertyName':'Поддержка карт памяти','propertyValue':'" +
                              (sdCard.equals("") ? "Off" : "true,1" ) +
                              "','propertyType':'numberBoolean','units':''}]");
                      Node imageNode = contentNode.getNode("image");
                      String pathToImageFolder = "/content/dam/portal/catalog/electronics/phones";
                      imageNode.setProperty("fileReference", pathToImageFolder + "/" + nameForNewNode + "/productimage.jpg");
                      contentNode.setProperty("D081D0BCD0BAD0BED181D182D18C20D0B0D0BAD0BAD183D0BCD183D0BBD18FD182D0BED180D0B0", battery);

                      if (!dualSim.equals("")){
                              contentNode.setProperty("D09FD0BED0B4D0B4D0B5D180D0B6D0BAD0B020D0BDD0B5D181D0BAD0BED0BBD18CD0BAD0B8D18520SIM-D0BAD0B0D180D182H", "on");
                              contentNode.setProperty("D09FD0BED0B4D0B4D0B5D180D0B6D0BAD0B020D0BDD0B5D181D0BAD0BED0BBD18CD0BAD0B8D18520SIM-D0BAD0B0D180D182W", "1");
                      }
                      if (!sdCard.equals("")){
                          contentNode.setProperty("D09FD0BED0B4D0B4D0B5D180D0B6D0BAD0B020D0BAD0B0D180D18220D0BFD0B0D0BCD18FD182D0B8H", "on");
                          contentNode.setProperty("D09FD0BED0B4D0B4D0B5D180D0B6D0BAD0B020D0BAD0B0D180D18220D0BFD0B0D0BCD18FD182D0B8W", "1");
                      }
                      contentNode.setProperty("D09AD0BED0BBD0B8D187D0B5D181D182D0B2D0BE20D182D0BED187D0B5D0BA20D0BCD0B0D182D180D0B8D186D18B", cameraSize);
                      contentNode.setProperty("D0A0D0B0D0B7D0BCD0B5D18020D18DD0BAD180D0B0D0BDD0B0", screenSize);
                      contentNode.setProperty("D0A0D0B0D0B7D180D0B5D188D0B5D0BDD0B8D0B520D18DD0BAD180D0B0D0BDD0B0H", firstResolutionParameter);
                      contentNode.setProperty("D0A0D0B0D0B7D180D0B5D188D0B5D0BDD0B8D0B520D18DD0BAD180D0B0D0BDD0B0W", secondResolutionParameter);
                      contentNode.setProperty("D09ED0BFD0B5D180D0B0D186D0B8D0BED0BDD0BDD0B0D18F20D181D0B8D181D182D0B5D0BCD0B0", os);
                      contentNode.setProperty("D0A2D0B5D185D0BDD0BED0BBD0BED0B3D0B8D18F20D18DD0BAD180D0B0D0BDD0B0", screenTexnology);
                      contentNode.setProperty("D0A4D0BBD18DD188-D0BFD0B0D0BCD18FD182D18C", hdd);
                      contentNode.setProperty("D0A6D0B2D0B5D18220D0BAD0BED180D0BFD183D181D0B0", color);
                      contentNode.setProperty("D092D181D182D180D0BED0B5D0BDD0BDD0B0D18F20D0BAD0B0D0BCD0B5D180D0B0H", "on");
                      contentNode.setProperty("D092D181D182D180D0BED0B5D0BDD0BDD0B0D18F20D0BAD0B0D0BCD0B5D180D0B0W", "1");
                      contentNode.setProperty("brand", brand);
                      contentNode.setProperty("model", model);

                       uploadImage(imageURL, nameForNewNode);

                      cqSession.save();
                  }
              } catch (Exception e) {
                  System.out.println(e);
              }
          }
      }

      private  void uploadImage(String imageURL, String folderName) throws IOException, RepositoryException {
          String pathToImageFolder = "/content/dam/portal/catalog/electronics/phones";
          Node categoryNode = cqSession.getNode(pathToImageFolder);
          Node imageFolderNode = categoryNode.addNode(folderName);
          imageFolderNode.setPrimaryType("sling:OrderedFolder");

           AssetManager assetMgr = resourceResolver.adaptTo(com.day.cq.dam.api.AssetManager.class);
            Asset asset = assetMgr.createAsset(pathToImageFolder + "/" + folderName + "/productimage.jpg", sendRequest(imageURL), "image/jpeg", true);
      }

      private InputStream sendRequest(String url) throws IOException {
          URL obj = null;
          obj = new URL("http://" + url);
          HttpURLConnection con = (HttpURLConnection) obj.openConnection();
          con.setRequestMethod("GET");

          return con.getInputStream();
      }


      private static JsonArray sendOnlinerRequests(int countOfPage)  {
          try {
              StringBuilder response = null;
              JsonParser jsonParser = new JsonParser();

              JsonArray globalJsonArray = null;
              for (int i = 1; i < countOfPage + 1; i++) {
                  URL obj = null;
                  obj = new URL("https://catalog.api.onliner.by/search/mobile?group=1&page=" + i);
                  HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                  con.setRequestMethod("GET");
                  InputStreamReader inputStreamReader = new InputStreamReader(con.getInputStream(),"UTF-8");
                  BufferedReader in = new BufferedReader(inputStreamReader);
                  String inputLine;
                  response = new StringBuilder();
                  while ((inputLine = in.readLine()) != null) {
                      response.append(inputLine);
                  }
                  if (globalJsonArray == null) {
                      globalJsonArray = jsonParser.parse(response.toString()).getAsJsonObject().get("products").getAsJsonArray();
                  } else {
                      globalJsonArray.addAll(jsonParser.parse(response.toString()).getAsJsonObject().get("products").getAsJsonArray());
                  }
                  Thread.sleep(500);
              }
              return globalJsonArray;
          }
          catch (Exception e){
              return null;
          }
      }

}
