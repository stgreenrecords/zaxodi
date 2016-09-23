package portal.core.servlets;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.services.RecaptchaService;
import portal.core.services.mail.PortalMailService;
import portal.core.services.users.PortalUserManager;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import java.io.*;
import java.net.URL;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/registration")
})
public class RegistrationServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(RegistrationServlet.class);

    @Reference
    private PortalUserManager portalUserManager;

    @Reference
    private PortalMailService portalMailService;

    @Reference
    private RecaptchaService repatchaService;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String responseCaptcha = request.getParameter(Constants.RE_CAPTCHA_REQUEST_PARAMETER);
        if (getResponseFromCaptcha(request, response, responseCaptcha)) {
            boolean registrationStatus = doRegistration(request, response);
            PrintWriter writer = response.getWriter();
            writer.print(registrationStatus ? Constants.STATUS_REGISTRATION_SUCCESS : Constants.STATUS_REGISTRATION_FAIL);
        }
    }

    private boolean getResponseFromCaptcha(SlingHttpServletRequest request, SlingHttpServletResponse response, String responseCaptcha) throws IOException {
        String googleSecret = repatchaService.getSecret();
        if (StringUtils.EMPTY.equals(googleSecret)) {
            LOG.info("CONFIG FOR GOOGLE RECAPTCHA IS EMPTY");
            return false;
        }
        LOG.info("TRY SEND REQUEST TO GOOGLE : " + Constants.RE_CAPTCHA_URL);
        URL url = new URL(Constants.RE_CAPTCHA_URL);
        HttpsURLConnection httpsURLConnection = (HttpsURLConnection) url.openConnection();
        httpsURLConnection.setRequestMethod("POST");
        httpsURLConnection.setDoOutput(true);
        OutputStream httpsURLConnectionOutputStream = httpsURLConnection.getOutputStream();
        httpsURLConnectionOutputStream.write(("secret=" + googleSecret + "&response=" + responseCaptcha).getBytes());
        httpsURLConnectionOutputStream.flush();
        httpsURLConnectionOutputStream.close();
        BufferedReader bufferedReader = new BufferedReader(
                new InputStreamReader(httpsURLConnection.getInputStream()));
        String inputLine;
        StringBuffer responseString = new StringBuffer();

        while ((inputLine = bufferedReader.readLine()) != null) {
            responseString.append(inputLine);
        }
        bufferedReader.close();
        LOG.info("RESPONSE FROM GOOGLE : " + responseString.toString());
        return responseString.toString().contains("\"success\": true");
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
