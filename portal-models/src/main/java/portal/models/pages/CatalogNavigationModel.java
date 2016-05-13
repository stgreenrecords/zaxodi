package portal.models.pages;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables=Resource.class)
public class CatalogNavigationModel extends BaseModel{

    List<CatalogSuperCategoriesPageModel> catalogSuperCategoriesPageModelList = new ArrayList();


    public List<CatalogSuperCategoriesPageModel> getCatalogMap(){
       Iterator<Page> pageIterator = getCatalogRootPage().listChildren();
        while (pageIterator.hasNext()){
            catalogSuperCategoriesPageModelList.add(pageIterator.next().getContentResource().adaptTo(CatalogSuperCategoriesPageModel.class));
        }
       return catalogSuperCategoriesPageModelList;
    }


}
