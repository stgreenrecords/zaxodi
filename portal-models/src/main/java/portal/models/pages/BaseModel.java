package portal.models.pages;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import portal.models.Constants;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Session;

@Model(adaptables=Resource.class)
public class BaseModel{

    @Self
    protected Resource selfResource;

    @Inject
    protected ResourceResolver resourceResolver;

    protected Page rootContentPage;

    private Page currentPage;

    @PostConstruct
    protected void init() {
        currentPage = selfResource.getParent().getParent().adaptTo(Page.class);
        rootContentPage = currentPage.getAbsoluteParent(1);
    }

    public String getHomePath(){
        return rootContentPage.getPath();
    }

    public Page getOwnPage(){
        return currentPage;
    }

    public ResourceResolver getResourceResolver(){
        return resourceResolver;
    }

    public Session getSession() {
        return resourceResolver.adaptTo(Session.class);
    }

    public ValueMap getPageProperties(){
        return currentPage.getProperties();
    }

    public ValueMap getComponentProperties(){
        return selfResource.getValueMap();
    }

    public String getComponentPropertyAsString(String propertyName){
       return selfResource.getValueMap().get(propertyName, String.class);
    }

    public Page getHomePage(){
        return rootContentPage;
    }

    public Page getCatalogRootPage(){
       return resourceResolver.getResource(Constants.CATALOG_ROOT_PAGE_PATH).adaptTo(Page.class);
    }

}
