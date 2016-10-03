package portal.models;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;

import javax.servlet.http.Cookie;

@Model(adaptables=SlingHttpServletRequest.class)
public class AuthenticationModel {

    private SlingHttpServletRequest request;

    public AuthenticationModel(SlingHttpServletRequest request) {
        this.request = request;
    }

    public String getCookie(){
        Cookie cookie = request.getCookie("portalAuthorization");
        return cookie == null ? StringUtils.EMPTY : cookie.getValue();
    }


}
