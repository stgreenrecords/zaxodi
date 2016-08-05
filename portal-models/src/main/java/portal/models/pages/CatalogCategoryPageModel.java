package portal.models.pages;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.models.BaseModel;

@Model(adaptables = Resource.class)
public class CatalogCategoryPageModel extends BaseModel {

    public CatalogCategoryPageModel(Resource resource) {
        super(resource);
    }

}
