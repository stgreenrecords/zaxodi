package portal.models.pages;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.core.data.Constants;
import portal.models.BaseModel;

import java.util.*;

@Model(adaptables = Resource.class)
public class CatalogSuperCategoriesPageModel extends BaseModel {

    Map<String, List<CatalogCategoryPageModel>> catalogCategoryPageModelMap = new LinkedHashMap();

    public CatalogSuperCategoriesPageModel(Resource resource) {
        super(resource);
    }

    public Map<String, List<CatalogCategoryPageModel>> getCatalogCategoryPageModelMap() {
        Iterator<Page> superCategoryPageIterator = getOwnPage().listChildren();
        while (superCategoryPageIterator.hasNext()) {
            Page subCategoryPage = superCategoryPageIterator.next();
            String subCategoryTopic = getPropertyFromResourceType(subCategoryPage.getPath(), Constants.CATALOG_ITEM_LIST_PATH, Constants.SUBCATEGORY_PROPERTY);
            if (!catalogCategoryPageModelMap.containsKey(subCategoryTopic)) {
                List<CatalogCategoryPageModel> catalogCategoryPageModelList = new ArrayList<CatalogCategoryPageModel>();
                catalogCategoryPageModelList.add(subCategoryPage.adaptTo(CatalogCategoryPageModel.class));
                catalogCategoryPageModelMap.put(subCategoryTopic, catalogCategoryPageModelList);
            } else {
                catalogCategoryPageModelMap.get(subCategoryTopic).add(subCategoryPage.adaptTo(CatalogCategoryPageModel.class));
            }
        }
        return catalogCategoryPageModelMap;
    }

}
