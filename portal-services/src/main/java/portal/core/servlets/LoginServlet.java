package portal.core.servlets;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.services.users.PortalUserManager;
import portal.core.utils.PortalUtils;
import portal.core.utils.ServerUtil;

import javax.jcr.*;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

@SlingServlet(paths = {"/services/login"})
public class LoginServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(LoginServlet.class);

    @Reference
    private PortalUserManager portalUserManager;

    @Reference
    private Repository repository;

    @Reference
    private PortalUtils portalUtils;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String pass = request.getParameter("pass");
        PrintWriter writer = null;
        LOG.info("TRY TO LOGIN AS: " + email);
        Authorizable authorizable = null;
        boolean validationStatus = false;
        try {
            authorizable = portalUtils.getAdminSession().getUserManager().getAuthorizable(email);
            validationStatus  = authorizable.getProperty("verifiedStatus")[0].getBoolean();
        } catch (RepositoryException e) {
          LOG.error(e.getMessage());
        }
        if (authorizable != null) {
            if (validationStatus){
            Session session = null;
            try {
                session = repository.login(new SimpleCredentials(email, pass.toCharArray()));
            } catch (RepositoryException e) {
                writer = response.getWriter();
                writer.print(Constants.STATUS_WRONG_PASS);
            }
            if (session != null) {
                String pathForRedirect = ServerUtil.getServerInfo(request) + "/content/portal.html";
                LOG.info("USER " + session.getUserID() + " success login.");
                response.sendRedirect(pathForRedirect);
            }
            } else {
                writer = response.getWriter();
                writer.print(Constants.STATUS_USER_IS_INVALID);
            }
        } else {
            writer = response.getWriter();
            writer.print(Constants.STATUS_USER_DOESNOT_EXIST);
        }
    }
}
