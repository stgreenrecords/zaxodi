package portal.core.servlets;

import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.services.users.PortalUserManager;
import portal.core.services.users.impl.PortalUserManagerImpl;

import javax.servlet.ServletException;
import java.io.IOException;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/verifying")
})
public class VerifyingServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(VerifyingServlet.class);

    @Reference
    private PortalUserManager portalUserManager;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String email = request.getRequestPathInfo().getSuffix().replace("/", "");
        LOG.info("TRY VERIFY USER : " + email);
        portalUserManager.addVerifyStatus(email);
        String pathForRedirect = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/content/portal/registration.html?verifyStatus=true";
        LOG.info("VERIFY USER SUCCESS. TRY REDIRECT TO :" + pathForRedirect);
        response.sendRedirect(pathForRedirect);
    }
}
