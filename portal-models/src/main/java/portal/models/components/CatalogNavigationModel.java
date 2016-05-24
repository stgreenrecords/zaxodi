package portal.models.components;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.models.BaseModel;
import portal.models.pages.CatalogSuperCategoriesPageModel;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables=Resource.class)
public class CatalogNavigationModel extends BaseModel {

    List<CatalogSuperCategoriesPageModel> catalogSuperCategoriesPageModelList = new ArrayList();

    public List<CatalogSuperCategoriesPageModel> getCatalogMap(){
        if (getCatalogRootPage() != null) {
            Iterator<Page> pageIterator = getCatalogRootPage().listChildren();
            while (pageIterator.hasNext()){
                catalogSuperCategoriesPageModelList.add(pageIterator.next().getContentResource().adaptTo(CatalogSuperCategoriesPageModel.class));
            }
        }
       return catalogSuperCategoriesPageModelList;
    }


}
