package portal.models.components;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.models.BaseModel;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Model(adaptables = Resource.class)
public class BestProductsModel extends BaseModel {

    private static final Logger LOG = LoggerFactory.getLogger(BestProductsModel.class);

    public BestProductsModel(Resource resource) {
        super(resource);
    }

    public List<ProductInfoModel> getBestProductsList() {
        List<ProductInfoModel> productInfoModelTreeMap = new ArrayList<ProductInfoModel>();
        List<String> propertiesList = new ArrayList();
        Map<String, String> predicates = new HashMap<String, String>();
        predicates.put("path", Constants.CATALOG_PATH);
        predicates.put("property", Constants.BASKET_PLACED_PROPERTY);
        predicates.put("property.operation", "exists");
        predicates.put("orderby", "@" + Constants.BASKET_PLACED_PROPERTY);
        predicates.put("orderby.sort", "desc");
        predicates.put("p.limit", "-1");

        Query query = getQueryBuilder().createQuery(PredicateGroup.create(predicates), resourceResolver.adaptTo(Session.class));
        SearchResult result = query.getResult();
        List<Hit> resultHits = result.getHits();
        for (Hit hit : resultHits) {
            Resource productInfoResource = null;
            try {
                productInfoResource = hit.getResource();
            } catch (RepositoryException e) {
                LOG.error(e.getMessage());
            }
            productInfoModelTreeMap.add(productInfoResource.adaptTo(ProductInfoModel.class));
        }
        return productInfoModelTreeMap;
    }


}
