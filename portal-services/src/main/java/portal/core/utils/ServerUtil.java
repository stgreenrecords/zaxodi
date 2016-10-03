package portal.core.utils;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;

import javax.servlet.http.Cookie;

@Component(metatype = true, immediate = true)
@Service(ServerUtil.class)
public class ServerUtil {

    @Property
    private static final String AUTHOR_LINK = "author_link";

    @Property
    private static final String PUBLISH_LINK = "publish_link";

    @Property
    private static final String DISPATCHER_LINK = "dispatcher_link";

    private ComponentContext componentContext;

    @Activate
    public void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    public String getAuthorLink(){
        return PropertiesUtil.toString(componentContext.getProperties().get(AUTHOR_LINK), StringUtils.EMPTY);
    }

    public String getPublishLink(){
        return PropertiesUtil.toString(componentContext.getProperties().get(PUBLISH_LINK), StringUtils.EMPTY);
    }

    public String getDispatcherLink(){
        return PropertiesUtil.toString(componentContext.getProperties().get(DISPATCHER_LINK), StringUtils.EMPTY);
    }

    public static String getServerInfo(SlingHttpServletRequest request){
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

}
