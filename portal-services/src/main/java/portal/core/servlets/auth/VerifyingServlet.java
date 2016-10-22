package portal.core.servlets.auth;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.util.Base64;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.services.users.PortalUserManager;
import portal.core.utils.PortalUtils;
import portal.core.utils.ServerUtil;

import javax.jcr.RepositoryException;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

@SlingServlet(paths = {"/services/verifying"})
public class VerifyingServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(VerifyingServlet.class);

    @Reference
    private PortalUserManager portalUserManager;

    @Reference
    private PortalUtils portalUtils;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String email = Base64.decode(request.getRequestPathInfo().getSuffix().replace("/", ""));
        LOG.info("TRY VERIFY USER : " + email);
        portalUserManager.addVerifyStatus(email);
        String pathForRedirect = ServerUtil.getServerInfo(request) + "/content/portal/login.html?verifyStatus=true";
        LOG.info("VERIFY USER SUCCESS. TRY REDIRECT TO :" + pathForRedirect);
        response.sendRedirect(pathForRedirect);
    }

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String sessionID = request.getParameter(Constants.AUTH_COOKIE_NAME);
        String email = request.getParameter(Constants.EMAIL_COOKIE_NAME);
        PrintWriter writer = null;
        JackrabbitSession jackrabbitSession = portalUtils.getAdminSession();
        if (jackrabbitSession != null) {
            try {
                Authorizable authorizable = jackrabbitSession.getUserManager().getAuthorizable(email);
                if (sessionID.equals(authorizable.getProperty(Constants.AUTH_COOKIE_NAME)[0].getString())) {
                    LOG.info("USER WAS LOGINED AS " + email);
                    writer = response.getWriter();
                    writer.print(portalUserManager.getPortalUserInfoAsJson(email));
                }
            } catch (RepositoryException e) {
                LOG.error("FAIL TO GET USER FROM COOKIE. USER: " + email + ". Detail: " + e.getMessage());
            }
        }
    }

}
