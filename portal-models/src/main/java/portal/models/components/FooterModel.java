package portal.models.components;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.models.BaseModel;
import portal.models.Constants;

import java.util.Iterator;

@Model(adaptables = Resource.class)
public class FooterModel extends BaseModel {

    public FooterModel(Resource resource) {
        super(resource);
    }

    public String getFooterText(){
    Iterator<Resource> resourceIterator = rootContentPage.getContentResource().getChildren().iterator();
    while (resourceIterator.hasNext()){
        Resource resource = resourceIterator.next();
        if (resource.getResourceType().contains(Constants.RESOURCE_TYPE__FOOTER)){
            return resource.getValueMap().get(Constants.RICH_TEXT_PROPERTY, String.class);
        }
    }
    return null;
}

}
