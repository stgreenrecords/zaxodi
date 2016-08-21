package portal.core.utils;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;

@Component(metatype = true, immediate = true)
@Service(ConstantProviderService.class)
public class ConstantProviderService {

    @Property
    static final String PUBLISH_NAME_PROPERTY = "publish";

    @Property
    static final String AUTHOR_NAME_PROPERTY = "author";

    @Property
    static final String DISPATCHER_NAME_PROPERTY = "dispatcher";

    private ComponentContext componentContext;

    public String getPublishName() {
        return PropertiesUtil.toString(componentContext.getProperties().get(PUBLISH_NAME_PROPERTY), StringUtils.EMPTY);
    }

    public String getAuthorName() {
        return PropertiesUtil.toString(componentContext.getProperties().get(AUTHOR_NAME_PROPERTY), StringUtils.EMPTY);
    }

    public String getDispatcherName() {
        return PropertiesUtil.toString(componentContext.getProperties().get(DISPATCHER_NAME_PROPERTY), StringUtils.EMPTY);
    }

    @Activate
    protected void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }
}
