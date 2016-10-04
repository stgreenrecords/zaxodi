package portal.core.servlets.auth;

import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/signin")
})
public class SignInServlet extends SlingAllMethodsServlet {

  /*  private static final Logger LOG = LoggerFactory.getLogger(SignInServlet.class);

    @Reference
    PortalUtils serviceUtils;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String extension = request.getRequestPathInfo().getExtension();
        LOG.info("START SIGN IN ACTION : " + extension);
        if (extension != null) {
            if (extension.equals("registration")) {
                String responseCaptcha = request.getParameter("response");
                boolean passedBotCheck = getResponseFromCaptcha(request, response, responseCaptcha);
                if (passedBotCheck) {
                    String registrationStatus = doRegistration(request, response);
                    PrintWriter writer = response.getWriter();
                    writer.print(registrationStatus);

                } else {
                    response.setCharacterEncoding(Constants.CHARSET_UTF_8);
                    PrintWriter writer = response.getWriter();
                    writer.print("failCaptcha");
                }
            }
            if (extension.equals("login")) {
                String statusLogin = doLogin(request, response);
                PrintWriter writer = response.getWriter();
                writer.print(statusLogin);
            }
        }
    }

    private String doRegistration(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        PortalUserManager portalUserManager = new PortalUserManagerImpl(request.getResourceResolver());
        String email = request.getParameter("email");
        String pass = request.getParameter("pass");
        if (portalUserManager.addPortalUser(email, pass)) {
            if (true*//*mailService.sendRegistrationMail(request)*//*) {
                return "registrationLetterSuccessSend";
            } else {
                return "registrationLetterFailSend";
            }

        } else {
            return "exist";
        }
    }

    private boolean getResponseFromCaptcha(SlingHttpServletRequest request, SlingHttpServletResponse response, String responseCaptcha) throws IOException {
        LOG.info("TRY SEND REQUEST TO GOOGLE : " + Constants.RE_CAPTCHA_URL);
        URL url = new URL(Constants.RE_CAPTCHA_URL);
        HttpsURLConnection httpsURLConnection = (HttpsURLConnection) url.openConnection();
        httpsURLConnection.setRequestMethod("POST");
        httpsURLConnection.setDoOutput(true);
        OutputStream httpsURLConnectionOutputStream = httpsURLConnection.getOutputStream();
        httpsURLConnectionOutputStream.write(("secret=6LdaLRMTAAAAAE4MjTuwCus5UJse93HxIaST_FWC&response=" + responseCaptcha).getBytes());
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

    private String doLogin(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        JackrabbitSession jackrabbitSession = serviceUtils.getAdminSession(request.getResourceResolver());
        String email = request.getParameter("email");
        LOG.info("TRY LOGIN AS " + email);
        String pass = request.getParameter("pass");
        PrincipalManager principalManager = null;
        try {
            principalManager = jackrabbitSession.getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            PortalUserManager portalUserManager = new PortalUserManagerImpl(request.getResourceResolver());
            if (principal == null) {
                LOG.info("USER WITH THAT NAME - "+email+" DOESN't EXIST");
                return "fail";
            }
            if (!portalUserManager.isVerify(email)) {
                LOG.info("USER WITH THAT NAME - "+email+" EXIST BUT NOT VERIFY");
                return "notVerified";
            }
            jackrabbitSession.logout();
            Session newSession = jackrabbitSession.getRepository().login(new SimpleCredentials(email, pass.toCharArray()));
            String loginStatus = newSession == null ? "fail" : "loginSuccess";
            LOG.info("LOGIN STATUS "+loginStatus);
            return loginStatus;

        } catch (RepositoryException e) {
            LOG.error("ERROR WITH LOGIN "+e.getMessage());
            return "fail";
        }
    }*/

}
