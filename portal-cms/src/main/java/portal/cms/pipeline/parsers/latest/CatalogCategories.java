package portal.cms.pipeline.parsers.latest;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.day.cq.wcm.foundation.Search;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.Properties;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;


import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;
import javax.jcr.lock.LockException;
import javax.jcr.nodetype.ConstraintViolationException;
import javax.jcr.version.VersionException;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/pagegerenation/categories")
})
public class CatalogCategories extends SlingAllMethodsServlet{

    private static final String CSS_SELECTOR = ".product-specs__table tbody tr:not(.product-specs__table-title)";


    @Reference
    private ResourceResolverFactory resolverFactory;

    private ResourceResolver resourceResolver;

    private PageManager pageManager;

    private Set<String> categoriesSet = new HashSet<>();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            resourceResolver = resolverFactory.getAdministrativeResourceResolver(null);
            pageManager = resourceResolver.adaptTo(PageManager.class);
            Document document = Jsoup.connect("https://catalog.onliner.by").get();
            Elements mainNavigation = document.select(".catalog-navigation");
            Elements mainList = mainNavigation.select(".catalog-navigation-classifier .catalog-navigation-classifier__item");
            Elements innerList = mainNavigation.select(".catalog-navigation-list__wrapper");
            for (Element mainLi : mainList) {
                String dataID = mainLi.attr("data-id");
                Element superCategoryTitle = mainLi.select(".catalog-navigation-classifier__item-title-wrapper").get(0);
                String titleOfSuperCategory = superCategoryTitle.text();
                String translitName = null;
                switch (titleOfSuperCategory){
                    case "Электроника" : translitName = "electronics"; break;
                    case "Компьютеры и сети" : translitName = "computers-networks"; break;
                    case "Бытовая техника" : translitName = "appliances"; break;
                    case "Стройка и ремонт" : translitName = "construction-repair"; break;
                    case "Дом и сад" : translitName = "house-garden"; break;
                    case "Авто и мото" : translitName = "auto-moto"; break;
                    case "Красота и спорт" : translitName = "beauty-sport"; break;
                    case "Детям и мамам" : translitName = "babie-mothers"; break;
                    case "Работа и офис" : translitName = "work-office"; break;
                }
                Page superCategoryPage = pageManager.create("/content/portal/catalog", translitName, "/apps/portal/templates/simpletemplate", titleOfSuperCategory);
                Elements innerCategories = innerList.select(".catalog-navigation-list__category[data-id="+dataID+"]");
                for (Element innerCategory : innerCategories){
                    Elements groupElements = innerCategory.select(".catalog-navigation-list__group");
                    for (Element group : groupElements){
                        String groupTitle = group.select(".catalog-navigation-list__group-title").get(0).text();
                        Elements listCategory = group.select(".catalog-navigation-list__link a");
                        for (Element category : listCategory){
                            String path = category.attr("href");
                            String name = path.substring(path.lastIndexOf("/")+1, path.contains("?") ? path.indexOf("?") : path.length());
                            String categoryTitle = category.text();
                            if (categoriesSet.add(categoryTitle)){
                                Page categoryPage = pageManager.create(superCategoryPage.getPath(), name, "/apps/portal/templates/catalogcategorytemplate", categoryTitle);
                                categoryPage.getContentResource().adaptTo(Node.class).setProperty("subCategory", groupTitle);
                            }

                        }
                    }
                }

            }



            resourceResolver.commit();
        } catch (LoginException e) {
            e.printStackTrace();
        } catch (WCMException e) {
            e.printStackTrace();
        } catch (VersionException e) {
            e.printStackTrace();
        } catch (LockException e) {
            e.printStackTrace();
        } catch (ConstraintViolationException e) {
            e.printStackTrace();
        } catch (ValueFormatException e) {
            e.printStackTrace();
        } catch (RepositoryException e) {
            e.printStackTrace();
        }

    }





/*    public Map<String, Object> getContentAsProperties(String urlPath) {
        try {
            return getProperties(urlPath);
        } catch (IOException e) {
           // LOG.error("Error occurred while obtaining properties.", e);
        }
        return Collections.emptyMap();
    }*/

  /*  private Map<String, Object> getProperties(String urlPath) throws IOException {
        //return Collections.emptyMap();
        Document document = Jsoup.connect("https://catalog.onliner.by").get();
        Elements elements = document.select(CSS_SELECTOR);
        return StreamSupport.stream(elements.spliterator(), true)
                .map(this::convertToPair)
                .collect(Collectors.toMap(Pair::getKey, Pair::getValue));
    }

    private Pair<String, String> convertToPair(Element element) {
        Elements elements = element.getElementsByTag("td");
        String key = getElementText(elements.get( 0 ));
        String value = getElementText(getTextElement(elements.get(1)));
        return new ImmutablePair<>(key, value);
    }

    private Element getTextElement(Element element) {
        Elements elements = element.select(".value__text");
        return elements.size() > 0 ? elements.get( 0 ) : element;
    }

    private String getElementText(Element element) {
        List<TextNode> textNodes = element.textNodes();
        if (textNodes != null && textNodes.size() > 0) {
            return textNodes.get(0).text().trim().toLowerCase();
        }
        return StringUtils.EMPTY;
    }*/




}
