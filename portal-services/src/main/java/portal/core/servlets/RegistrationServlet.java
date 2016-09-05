package portal.core.servlets;

import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.services.mail.PortalMailService;
import portal.core.services.users.PortalUserManager;

import javax.servlet.ServletException;
import java.io.*;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/registration")
})
public class RegistrationServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(RegistrationServlet.class);

    @Reference
    PortalUserManager portalUserManager;

    @Reference
    PortalMailService portalMailService;

    @Property
    static final String GOOGLE_SECRET = "google_secret";

    private ComponentContext componentContext;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String responseCaptcha = request.getParameter(Constants.RE_CAPTCHA_REQUEST_PARAMETER);
        if (getResponseFromCaptcha(request, response, responseCaptcha)) {
            boolean registrationStatus = doRegistration(request, response);
            PrintWriter writer = response.getWriter();
            writer.print(registrationStatus ? Constants.STATUS_REGISTRATION_SUCCESS : Constants.STATUS_REGISTRATION_FAIL);
        }
    }

    @Activate
    protected void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    private boolean getResponseFromCaptcha(SlingHttpServletRequest request, SlingHttpServletResponse response, String responseCaptcha) throws IOException {
        String googleSecret = PropertiesUtil.toString(componentContext.getProperties().get(GOOGLE_SECRET), StringUtils.EMPTY);
        if (StringUtils.EMPTY.equals(googleSecret)) {
            LOG.info("CONFIG FOR GOOGLE RECAPTCHA IS EMPTY");
            return false;
        }
        LOG.info("TRY SEND REQUEST TO GOOGLE : " + Constants.RE_CAPTCHA_URL);
        String remoteAddr = request.getRemoteAddr();
        ReCaptchaImpl reCaptcha = new ReCaptchaImpl();
        reCaptcha.setPrivateKey(googleSecret);

        String challenge = request.getParameter("recaptcha_challenge_field");
        String uresponse = request.getParameter(Constants.RE_CAPTCHA_REQUEST_PARAMETER);
        ReCaptchaResponse reCaptchaResponse = reCaptcha.checkAnswer(remoteAddr, challenge, uresponse);

        return reCaptchaResponse.isValid();
    }

    private boolean doRegistration(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        String email = request.getParameter("email");
        String pass = request.getParameter("pass");
        boolean statusRegistration = portalUserManager.addPortalUser(email, pass);
        if (statusRegistration) {
            portalMailService.sendRegistrationMail(email);
        }
        return statusRegistration;
    }


}
