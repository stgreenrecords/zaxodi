package portal.models.pages;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import portal.core.services.RecaptchaService;
import portal.models.BaseModel;

import javax.inject.Inject;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LoginPageModel extends BaseModel {

    public LoginPageModel(Resource resource) {
        super(resource);
    }

    @Inject
    private RecaptchaService recaptchaService;

    public String getReferrer() {
        String fullReferrer = null/*getRequest().getHeader("referer")*/;
        if (fullReferrer != null && fullReferrer.contains("portal") && !fullReferrer.contains("/portal/registration.html")) {
            String withOutScheme = fullReferrer.substring(fullReferrer.indexOf("//") + 2, fullReferrer.length());
            return withOutScheme.substring(withOutScheme.indexOf("/"), withOutScheme.length());
        } else {
            fullReferrer = "/content/portal.html";
        }
        return fullReferrer;
    }

    public String getRecaptchKey() {
        return recaptchaService.getKeyHtml();
    }

}
