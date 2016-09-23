package portal.core.services.users;

import portal.core.services.users.beans.PortalUser;
import portal.core.services.users.beans.Seller;


import java.util.Date;

public interface PortalUserManager {

    boolean addPortalUser(String email, String pass);

    boolean updateSeller(String email, Date birthday, int age , String firstName, String lastName, String phoneNumber, String sex);

    boolean updateUser(String email, Date birthday, int age , String firstName, String lastName, String phoneNumber);

    boolean deleteUser(String email);

    boolean addNewSeller(String email, String pass);

    void addVerifyStatus(String email);

    boolean isVerify(String email);

    Seller getSeller(String email);

    PortalUser getPortalUser(String email);

}
