package portal.models.components;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import portal.models.BaseModel;
import portal.models.Constants;
import portal.models.beans.PromoBean;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Model(adaptables = Resource.class)
public class PromoModel extends BaseModel {

    Map<String, PromoBean> promoBeanMap;

    public PromoModel(Resource resource) {
        super(resource);
    }

    public Map<String, PromoBean> getPromoBeanMap() {
        if (promoBeanMap == null){
            setPromoBeanMap(collectInfo());
        }
        return promoBeanMap;
    }

    public void setPromoBeanMap(Map<String, PromoBean> promoBeanMap) {
        this.promoBeanMap = promoBeanMap;
    }

    public Map<String, PromoBean> collectInfo() {
        Map<String, PromoBean> promoMap = new HashMap();
        Iterator<Resource> resourceIterator = selfResource.getChildren().iterator();
        while (resourceIterator.hasNext()) {
            Resource resource = resourceIterator.next();
            ValueMap valueMap = resource.getValueMap();
            if (valueMap.containsKey(Constants.COMPONENT_IMAGE_REFERENCE_PROPERTY)) {
                promoMap.put(valueMap.get(Constants.COMPONENT_IMAGE_REFERENCE_PROPERTY, String.class),
                        new PromoBean(
                                valueMap.containsKey(Constants.COMPONENT_PROMO_PATH_PROPERTY) ? valueMap.get(Constants.COMPONENT_PROMO_PATH_PROPERTY, String.class) : null,
                                valueMap.containsKey(Constants.COMPONENT_PROMO_TITLE_TOP_PROPERTY) ? valueMap.get(Constants.COMPONENT_PROMO_TITLE_TOP_PROPERTY, String.class) : null,
                                valueMap.containsKey(Constants.COMPONENT_PROMO_TITLE__BOTTOM_PROPERTY) ? valueMap.get(Constants.COMPONENT_PROMO_TITLE__BOTTOM_PROPERTY, String.class) : null
                        )
                );
            }
        }
        return promoMap;
    }


}
