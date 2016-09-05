package portal.core.utils;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import javax.jcr.Repository;
import javax.jcr.RepositoryException;

import javax.jcr.SimpleCredentials;

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


    @Activate
    protected void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    public JackrabbitSession getAdminSession() {
            try {
                return  (JackrabbitSession) repository.login(new SimpleCredentials(
                        PropertiesUtil.toString(componentContext.getProperties().get(PROPERTY_LOGIN), StringUtils.EMPTY),
                        PropertiesUtil.toString(componentContext.getProperties().get(PROPERTY_PASS), StringUtils.EMPTY).toCharArray()));
            } catch (RepositoryException e) {
                LOG.error("CAN'T LOGIN AS ADMIN. "+ e.getMessage());
            }
            return null;
    }


}
