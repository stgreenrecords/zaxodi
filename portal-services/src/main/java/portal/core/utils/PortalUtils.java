package portal.core.utils;

import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import javax.jcr.Repository;

import javax.jcr.Session;

@Component
@Service(PortalUtils.class)
public class PortalUtils {

    private static final Logger LOG = LoggerFactory.getLogger(PortalUtils.class);

    @Reference
    private Repository repository;

    private ComponentContext componentContext;

    @Reference
    private ResourceResolverFactory resolverFactory;

    private ResourceResolver resourceResolver;

    @Activate
    private void activate(ComponentContext context) throws LoginException {
        resourceResolver = resolverFactory.getAdministrativeResourceResolver(null);
    }


    public JackrabbitSession getAdminSession() {
         return (JackrabbitSession) resourceResolver.adaptTo(Session.class);
    }

    public static String getServerInfo(SlingHttpServletRequest request){
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

}
