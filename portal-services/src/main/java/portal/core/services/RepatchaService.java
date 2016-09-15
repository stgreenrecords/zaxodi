package portal.core.services;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.osgi.service.component.ComponentContext;

@Component(metatype = true, immediate = true)
@Service
public class RepatchaService {

    private ComponentContext componentContext;

    @Property
    static final String GOOGLE_SECRET = "google_secret";

    @Property
    static final String GOOGLE_KYE_HTML = "google_key_html";

    @Activate
    protected void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    public String getSecret(){
        return PropertiesUtil.toString(componentContext.getProperties().get(GOOGLE_SECRET), StringUtils.EMPTY);
    }

    public String getKeyHtml(){
        return PropertiesUtil.toString(componentContext.getProperties().get(GOOGLE_KYE_HTML), StringUtils.EMPTY);
    }

}
