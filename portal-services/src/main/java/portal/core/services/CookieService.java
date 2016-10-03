package portal.core.services;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.util.Base64;
import org.apache.sling.api.SlingHttpServletResponse;

import javax.servlet.http.Cookie;
import java.util.UUID;

@Component(immediate = true, metatype = true)
@Service(CookieService.class)
public class CookieService {

    public String getCookieValue(String email){
        String uuid = UUID.randomUUID().toString();
        System.out.println(uuid);
        char[] uuidChars = uuid.toCharArray();
        StringBuilder finalEncrypt = new StringBuilder();
        if (email.length() % 2 != 0) {
            email = email.substring(0, email.length() - 1);
        }
        char[] emailChars = email.toCharArray();
        int counter = 0;
        for (Character character : uuidChars) {
            if (counter > emailChars.length / 2) {
                break;
            }
            String firstDecodedSymbol = Base64.encode(new Character(emailChars[emailChars.length - counter - 1]).toString()).replace("==", "");
            String secondDecodedSymbol = Base64.encode(new Character(emailChars[counter]).toString()).replace("==", "");
            finalEncrypt.append(character + firstDecodedSymbol + secondDecodedSymbol
            );
            counter++;
        }
        System.out.println(finalEncrypt.toString());
        return finalEncrypt.toString();
    }

    public boolean isCookieValid(){
        return false;
    }

    public static void addCookie(SlingHttpServletResponse response, String key, String value, int maxAge) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

}
