package portal.core.utils;

import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.scripting.SlingBindings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;


public class ServiceUtils {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceUtils.class);

    public static JackrabbitSession getAdminSession(ResourceResolver resourceResolver) {
        JackrabbitSession jackrabbitSession = (JackrabbitSession) resourceResolver.adaptTo(Session.class);
        Repository repository = jackrabbitSession.getRepository();
        if (jackrabbitSession != null && jackrabbitSession.isLive()) jackrabbitSession.logout();
        try {
            return jackrabbitSession = (JackrabbitSession) repository.login(new SimpleCredentials("admin", "admin".toCharArray()));
        } catch (RepositoryException e) {
            LOG.error(e.getMessage());
        }
        return null;
    }

    public static String getPublishName(SlingHttpServletRequest request) {
        final SlingBindings bindings = (SlingBindings) request.getAttribute(SlingBindings.class.getName());
        ConstantProviderService constantProviderService = bindings != null ? bindings.getSling().getService(ConstantProviderService.class) : null;
        if (constantProviderService == null){
            LOG.error("CAN'T GET SLING BINDING OR ConstantProviderService");
            return null;
        }
        return constantProviderService.getPublishName();
    }

    public static String getDispatcherName(SlingHttpServletRequest request) {
        final SlingBindings bindings = (SlingBindings) request.getAttribute(SlingBindings.class.getName());
        ConstantProviderService constantProviderService = bindings != null ? bindings.getSling().getService(ConstantProviderService.class) : null;
        if (constantProviderService == null){
            LOG.error("CAN'T GET SLING BINDING OR ConstantProviderService");
            return null;
        }
        return constantProviderService.getDispatcherName();
    }

    public static String getAuthorName(SlingHttpServletRequest request) {
        final SlingBindings bindings = (SlingBindings) request.getAttribute(SlingBindings.class.getName());
        ConstantProviderService constantProviderService = bindings != null ? bindings.getSling().getService(ConstantProviderService.class) : null;
        if (constantProviderService == null){
            LOG.error("CAN'T GET SLING BINDING OR ConstantProviderService");
            return null;
        }
        return constantProviderService.getAuthorName();
    }

}
