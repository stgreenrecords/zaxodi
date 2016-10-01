package portal.core.services;

import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;

@Component(immediate = true, metatype = true)
@Service(RecaptchaService.class)
public class RecaptchaService {

    private ComponentContext componentContext;

    @Property
    private static final String GOOGLE_SECRET = "google_secret";

    @Property
    private static final String GOOGLE_KYE_HTML = "google_key_html";

    @Activate
    public void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    public String getSecret() {
        return PropertiesUtil.toString(this.componentContext.getProperties().get(GOOGLE_SECRET), "");
    }

    public String getKeyHtml() {
        return PropertiesUtil.toString(this.componentContext.getProperties().get(GOOGLE_KYE_HTML), "");
    }

}
