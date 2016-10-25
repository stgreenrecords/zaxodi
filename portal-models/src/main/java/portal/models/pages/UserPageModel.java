package portal.models.pages;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import portal.core.data.Constants;
import portal.core.services.users.PortalUserManager;
import portal.core.services.users.beans.PortalUser;

import javax.inject.Inject;
import javax.servlet.http.Cookie;

@Model(adaptables = SlingHttpServletRequest.class)
public class UserPageModel {

    @Inject
    private PortalUserManager portalUserManager;

    private Cookie emailCookie;

    @Self
    private SlingHttpServletRequest slingHttpServletRequest;

    public PortalUser getPortalUser() {
        Cookie emailCookie = slingHttpServletRequest.getCookie(Constants.EMAIL_COOKIE_NAME);
        if (emailCookie == null) {
            return null;
        }
        String email = emailCookie.getValue();
        return portalUserManager.getPortalUser(email);
    }

}
