package portal.core.services.mail;

import com.day.cq.mailer.MailingList;
import com.day.cq.mailer.MailingStatus;
import com.day.cq.mailer.MailingStatusCode;
import com.day.cq.mcm.api.newsletter.NewsLetter;
import com.day.cq.mcm.api.newsletter.NewsletterService;
import com.day.cq.mcm.core.NewsletterHelper;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.utils.ServiceUtils;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

@Component(metatype = true, immediate = true)
@Service(MailService.class)
public class MailService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);

    @Reference
    com.day.cq.mailer.MailService mailService;

    @Reference
    NewsletterService newsletterService;

    public boolean sendRegistrationMail(SlingHttpServletRequest request) {
        try {
            JackrabbitSession jackrabbitSession = ServiceUtils.getAdminSession(request.getResourceResolver());
            Node registrationNode = jackrabbitSession.getNode("/content/campaigns/portal/notifications/userValidation/jcr:content/text");
            if (registrationNode.hasProperty("text")) {
                HtmlEmail email = new HtmlEmail();
                email.setCharset("UTF-8");
                email.setSubject("Письмо проверки пользователя");
                String html = registrationNode.getProperty("text").getString();
                String userEmail = request.getParameter("email");
                String link = "<a href='" + ServiceUtils.getPublishName(request) + "/services/verifying.registration/" + userEmail + "'>Ссылка для подтверждения регистрации</a>";
                LOG.info("SEND REGISTRATION EMAIL TO : " + userEmail);
                LOG.info("LINK TO VERIFICATION : " + link);
                String repairHtml = html.replace("${user}", userEmail).replace("${linkToVerification}", link);
                email.setHtmlMsg(repairHtml);
                email.setFrom("administration@portal-gomel.com");
                email.addTo(userEmail);
                mailService.send(email);
                LOG.info("REGISTRATION LETTER SUCCESS SEND");
                return true;
            }

        } catch (RepositoryException e) {
            LOG.error(e.getMessage());
        } catch (EmailException e) {
            LOG.error(e.getMessage());
        }
        return false;
    }

    public boolean sendNewsLetter(SlingHttpServletRequest request) throws RepositoryException, AddressException {
        NewsLetter newsLetter = NewsletterHelper.fromRequest(request, newsletterService);
        newsLetter.setFromAddress(new InternetAddress("administration@portal-gomel.com"));
        newsLetter.setSubject("Письмо проверки пользователя");
        String email = request.getParameter("letterRecipient");
/*        newsLetter.getMessageTemplate().put("user", email);
        newsLetter.getMessageTemplate().put("linkToVerification", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/services/verifying.registration/" + email);*/
        MailingList mailingList = newsletterService.createMailingList(email, request.getResourceResolver().adaptTo(Session.class));
        newsLetter.setMailingList(mailingList);
        MailingStatus mailingStatus = newsletterService.sendNewsletter(newsLetter);
        MailingStatusCode mailingStatusCode = mailingStatus.getStatusCode();
        return mailingStatusCode.equals(MailingStatusCode.SENT);

    }


}
