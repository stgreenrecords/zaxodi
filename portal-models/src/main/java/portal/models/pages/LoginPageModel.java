package portal.models.pages;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.core.services.RepatchaService;
import portal.models.BaseModel;

import javax.inject.Inject;

@Model(adaptables=Resource.class)
public class LoginPageModel extends BaseModel {

    public LoginPageModel(Resource resource) {
        super(resource);
    }

    @Inject
    RepatchaService repatchaService;

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

    public String getRecaptchKey(){
     return repatchaService.getKeyHtml();
    }

}
