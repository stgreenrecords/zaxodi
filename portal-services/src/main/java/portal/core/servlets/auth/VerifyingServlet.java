package portal.core.servlets.auth;

import org.apache.felix.scr.annotations.*;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.oak.spi.security.user.UserIdCredentials;
import org.apache.jackrabbit.oak.spi.security.user.util.PasswordUtil;
import org.apache.jackrabbit.oak.spi.security.user.util.UserUtil;
import org.apache.jackrabbit.util.Base64;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.services.users.PortalUserManager;
import portal.core.utils.ServerUtil;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

@SlingServlet(paths = {"/services/verifying"})
public class VerifyingServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(VerifyingServlet.class);

    @Reference
    private PortalUserManager portalUserManager;

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
        JackrabbitSession jackrabbitSession = (JackrabbitSession) request.getResourceResolver().adaptTo(Session.class);
        if (jackrabbitSession != null){
            try {
               Authorizable authorizable = jackrabbitSession.getUserManager().getAuthorizable(email);
                if (sessionID.equals(authorizable.getProperty(Constants.AUTH_COOKIE_NAME)[0].getString())){
                    if (!jackrabbitSession.getUserID().equals(email)){
                        User user = request.getResourceResolver().getResource(authorizable.getPath()).adaptTo(User.class);
                        jackrabbitSession.getRepository().login(user.getCredentials());
                        LOG.info("USER WAS LOGINED AS " + email);
                    }
                    writer = response.getWriter();
                    writer.print(Boolean.TRUE.toString());
                } else {
                    writer = response.getWriter();
                    writer.print(Boolean.FALSE.toString());
                }

            } catch (RepositoryException e) {
                LOG.error("FAIL TO GET USER FROM COOKIE. USER: " + email + ". Detail: " + e.getMessage());
            }
        }
    }

}
