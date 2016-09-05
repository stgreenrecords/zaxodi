package portal.core.utils;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import javax.jcr.Repository;
import javax.jcr.RepositoryException;

import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import java.util.HashMap;
import java.util.Map;

@Component
@Service(ServiceUtils.class)
public class ServiceUtils {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceUtils.class);

    @Reference
    private Repository repository;

    private ComponentContext componentContext;

    @Property
    public static final String PROPERTY_LOGIN = "admin_login";

    @Property
    public static final String PROPERTY_PASS = "admin_pass";

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


}
