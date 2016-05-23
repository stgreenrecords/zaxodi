package portal.models.components;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.models.BaseModel;

import java.util.UUID;

@Model(adaptables = Resource.class)
public class ColumnModel extends BaseModel {

    public String getUniqueName(){
        return UUID.randomUUID().toString();
    }

}
