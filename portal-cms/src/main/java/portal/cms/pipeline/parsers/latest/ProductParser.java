package portal.cms.pipeline.parsers.latest;


import com.day.cq.wcm.api.PageManager;
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
import org.jsoup.select.Elements;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
            Resource videoCamera = resourceResolver.getResource("/content/catalogmodel/electronics/video/e3e70a6e-ecc0-4483-b4c0-4149a1a28854");
            String pathToHTML = videoCamera.getValueMap().get("htmpPath", String.class);
            String microDescription = videoCamera.getValueMap().get("microdescription", String.class);
            String imagePath = videoCamera.getValueMap().get("imagePath", String.class);
            Document document = Jsoup.connect(pathToHTML).get();
            Elements listOfProperties = document.select(".product-specs__table tbody");
            listOfProperties.forEach( propertyGroup -> {
                String filterGroupName = propertyGroup.select(".product-specs__table-title-inner").first().text();
                printWriter.write("    Name of group Filter            " + filterGroupName + "\n");
                propertyGroup.select("tr:not(.product-specs__table-title)").forEach(propertyItem -> {
                    String propertyName = propertyItem.select(".product-tip__term").first().text();
                    Elements simpleValue = propertyItem.select("td .value__text");
                    Elements booleanNO = propertyItem.select("td .i-x");
                    Elements booleanYES = propertyItem.select(".i-tip");
                    String rawPropertyValue = simpleValue.size() == 0 ? booleanNO.size() == 0 ? booleanYES.text() : booleanNO.text() : simpleValue.text();
                    String propertyValue = "";
                    String propertyType = null;
                    if ((booleanNO.size() > 0 || booleanYES.size() > 0)) {
                        propertyType = "numberBoolean";
                    }
                    if (rawPropertyValue.contains(" x ")) {
                        propertyType = "size";
                    }
                    if (rawPropertyValue.split(" \\u2014 ").length > 1) {
                        propertyType = "interval";
                    }
                    if (rawPropertyValue.split("[+-]?([0-9]*[.])?[0-9]+/[+-]?([0-9]*[.])?[0-9]+").length > 1) {
                        propertyType = "attitude";
                    }
                    if (rawPropertyValue.split("\\u002C ").length > 1) {
                        propertyType = "enum";
                    }
                    if (StringUtils.isEmpty(propertyType) && StringUtils.isNotEmpty(rawPropertyValue) && (booleanYES.size() == 0 && booleanNO.size() == 0)) {
                        String pattern = "[+-]?([0-9]*[.])?[0-9]+";
                        Pattern floatPattern = Pattern.compile(pattern);
                        Matcher matcher = floatPattern.matcher(rawPropertyValue);
                            if (matcher.find()) {
                                propertyType = "float";
                            } else {
                                propertyType = "simpletext";
                        }
                    }
                    printWriter.write("        Property:                     " + propertyName + "        |        " + rawPropertyValue + "\n");
                });
            });









/*            Iterator<Resource> superCategoryIterator = resourceResolver.getResource("/content/catalogmodel").listChildren();
            while (superCategoryIterator.hasNext()) {
                Iterator<Resource> categoryIterator = superCategoryIterator.next().listChildren();
                while (categoryIterator.hasNext()) {
                    Iterator<Resource> productIterator = categoryIterator.next().listChildren();
                    while (productIterator.hasNext()) {
                        Resource productResource = productIterator.next();
                        String pathToHTML = productResource.getValueMap().get("htmpPath", String.class);
                        String microDescription = productResource.getValueMap().get("microdescription", String.class);
                        String imagePath = productResource.getValueMap().get("imagePath", String.class);
                        printWriter.write(pathToHTML + " " + microDescription + " " + imagePath);
                        break;
                    }
                    break;
                }
                break;
            }*/

        } catch (LoginException e) {
            e.printStackTrace();
        }
    }
}
