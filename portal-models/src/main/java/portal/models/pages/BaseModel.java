package portal.models.pages;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import portal.models.Constants;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Model(adaptables = Resource.class)
public class BaseModel {

    @Self
    protected Resource selfResource;

    @Inject
    protected ResourceResolver resourceResolver;

    @Inject
    QueryBuilder queryBuilder;

    protected Page rootContentPage;

    private Page currentPage;

    @PostConstruct
    protected void init() {
        currentPage = getPageFromResource(selfResource);
        rootContentPage = currentPage.getAbsoluteParent(1);
    }

    public String getHomePath() {
        return rootContentPage.getPath();
    }

    public Page getOwnPage() {
        return currentPage;
    }

    public ResourceResolver getResourceResolver() {
        return resourceResolver;
    }

    public Session getSession() {
        return resourceResolver.adaptTo(Session.class);
    }

    public ValueMap getPageProperties() {
        return currentPage.getProperties();
    }

    public ValueMap getComponentProperties() {
        return selfResource.getValueMap();
    }

    public String getComponentPropertyAsString(String propertyName) {
        return selfResource.getValueMap().get(propertyName, String.class);
    }

    public Page getHomePage() {
        return rootContentPage;
    }

    public Page getCatalogRootPage() {
        return resourceResolver.getResource(Constants.CATALOG_ROOT_PAGE_PATH).adaptTo(Page.class);
    }

    public String getPagePath() {
        return getOwnPage().getPath();
    }

    public String getPageTitle() {
        return getOwnPage().getTitle();
    }

    private Page getPageFromResource(Resource resource) {
        return resource.getResourceType().equals(Constants.RESOURCE_TYPE_CQ_PAGE) ? resource.adaptTo(Page.class) : getPageFromResource(resource.getParent());
    }

    public String getPropertyFromOwnPageWithResourceType(String resourceType, String propertyName) {
        List<String> propertiesList = getPropertyFromQueryBuilder(getPagePath(), resourceType, propertyName, true);
        return propertiesList.size() > 0 ? propertiesList.get(0) : null;
    }

    public String getPropertyFromResourceType(String path, String resourceType, String propertyName) {
        List<String> propertiesList = getPropertyFromQueryBuilder(path, resourceType, propertyName, true);
        return propertiesList.size() > 0 ? propertiesList.get(0) : null;
    }

    private List<String> getPropertyFromQueryBuilder(String path, String resourceType, String propertyName, boolean singleProperty) {
        List<String> propertiesList = new ArrayList();
        Map<String, String> map = new HashMap<String, String>();
        map.put("path", path);
        map.put("property", "sling:resourceType");
        map.put("property.value", resourceType);
        map.put("p.limit", "-1");

        Query query = queryBuilder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
        SearchResult result = query.getResult();

        for (Hit hit : result.getHits()) {
            Node searchNode = null;
            try {
                searchNode = hit.getNode();
                if (searchNode.hasProperty(propertyName)) {
                    propertiesList.add(searchNode.getProperty(propertyName).getString());
                }
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }
        return propertiesList;
    }

    public List<String> getAllPropertiesFromOwnPageWithResourceType(String resourceType, String propertyName) {
        return getPropertyFromQueryBuilder(getPagePath(), resourceType, propertyName, false);
    }

    public Resource getSelfResource() {
        return selfResource;
    }

    public void setSelfResource(Resource selfResource) {
        this.selfResource = selfResource;
    }
}
