package portal.core.services.users;

import com.google.gson.JsonObject;
import portal.core.services.users.beans.PortalUser;

import java.util.Date;

public interface PortalUserManager {

    boolean addPortalUser(String email, String pass);

    boolean updateSeller(String email, Date birthday, int age, String firstName, String lastName, String phoneNumber, String sex);

    boolean updateUser(String email, Date birthday, int age, String firstName, String lastName, String phoneNumber);

    boolean deleteUser(String email);

    boolean addNewSeller(String email, String pass);

    void addVerifyStatus(String email);

    boolean isVerify(String email);

    PortalUser getPortalUser(String email);

    public JsonObject getPortalUserInfoAsJson(String email);

}
