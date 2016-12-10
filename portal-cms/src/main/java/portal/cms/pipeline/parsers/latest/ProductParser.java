package portal.cms.pipeline.parsers.latest;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import portal.cms.pipeline.parsers.latest.beans.ProductItems;

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
        @Property(name = "sling.servlet.paths", value = "/services/pagegerenation/products")
})
public class ProductParser extends SlingAllMethodsServlet {

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
            Page rootPage = pageManager.getPage("/content/portal/catalog");
            printWriter = response.getWriter();
            Iterator<Page> superCategoriesIterator = rootPage.listChildren();
            int totalCount = 0;
            while (superCategoriesIterator.hasNext()) {
                Iterator<Page> categoriesIterator = superCategoriesIterator.next().listChildren();
                while (categoriesIterator.hasNext()) {
                    Page categoryPage = categoriesIterator.next();
//printWriter.write(categoryPage.getPath()+"\n");
                    Set<ProductItems> productItems = getDataFromCategory(categoryPage.getName());
                    if (productItems != null && productItems.size()>0){
                        totalCount += productItems.size();
                        mainMap.put(categoryPage.getName(), productItems);
                        productItems.forEach((product) -> printWriter.write(product.toString()));
                       // printWriter.write(categoryPage.getPath() + "\r\n");
                    }

                }

            }
            System.out.println("Всего" + totalCount + " продуктов");
        } catch (LoginException e) {
            e.printStackTrace();
        }
    }

    private static Set<ProductItems> getDataFromCategory(String categoryName)  {
        Set<ProductItems> productItems = new LinkedHashSet<>();
        try {
            StringBuilder response = null;
            JsonParser jsonParser = new JsonParser();


            for (int i = 1; i < 31; i++) {
                URL obj = null;
                obj = new URL("https://catalog.api.onliner.by/search/"+categoryName+"?group=1&page=" + i);
                HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                con.setRequestMethod("GET");
                InputStreamReader inputStreamReader = new InputStreamReader(con.getInputStream(),"UTF-8");
                BufferedReader in = new BufferedReader(inputStreamReader);
                String inputLine;
                response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                JsonObject parser = jsonParser.parse(response.toString()).getAsJsonObject();
                try {
                    if (parser != null && parser.has("products")){
                        for (JsonElement jsonElement : parser.get("products").getAsJsonArray()){
                            JsonObject jsonObject = jsonElement.getAsJsonObject();
                            String productPath = jsonObject.get("html_url").getAsString();
                            String microdescription = jsonObject.get("description").getAsString();
                            String imagePhotoUrl = jsonObject.get("images").getAsJsonObject().get("header").getAsString();
                            for (JsonElement jsonElement1 : jsonObject.get("children").getAsJsonArray()){
                                JsonObject jsonObject1 = jsonElement1.getAsJsonObject();
                                String productPath1 = jsonObject1.get("html_url").getAsString();
                                String microdescription1 = jsonObject1.get("description").getAsString();
                                String imagePhotoUrl1 = jsonObject1.get("images").getAsJsonObject().get("header").getAsString();
                                productItems.add(new ProductItems(imagePhotoUrl1,microdescription1,productPath1));
                            }
                            productItems.add(new ProductItems(imagePhotoUrl,microdescription,productPath));
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Thread.sleep(500);
            }
            return productItems;
        }
        catch (Exception e){
            return productItems;
        }
    }


}
