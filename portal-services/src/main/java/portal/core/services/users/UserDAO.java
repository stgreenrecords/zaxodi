package portal.core.services.users;

/**
 * Created by Viachaslau_Karnausha on 12/16/2015.
 */
public interface UserDAO {

    boolean addNewUser(String email, String pass);

    void addVerifyStatus(String email);

    boolean isVerify(String email);
}
