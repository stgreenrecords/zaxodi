package portal.models.pages;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import portal.models.Constants;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables=Resource.class)
public class NavigationModel extends BaseModel{

    public String getImagePath(){
        Iterator<Resource> resourceIterator = rootContentPage.getContentResource().getChildren().iterator();
        while (resourceIterator.hasNext()){
            Resource resource = resourceIterator.next();
            if (resource.getResourceType().contains(Constants.RESOURCE_TYPE__NAVIGATION)){
               return resource.getValueMap().get(Constants.COMPONENT_IMAGE_REFERENCE_PROPERTY, String.class);
            }
        }
        return null;
    }

    public List<Page> getChildPages(){
        List<Page> pageList = new ArrayList();
        Iterator<Page> pageIterator = rootContentPage.listChildren();
        while (pageIterator.hasNext()){
            Page childPage = pageIterator.next();
            if (!childPage.isHideInNav()){
                pageList.add(childPage);
            }
        }
        return pageList;
    }
}
