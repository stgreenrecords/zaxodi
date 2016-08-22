package portal.core.services.users;

import portal.core.services.users.beans.Comment;
import portal.core.services.users.beans.Seller;
import portal.core.services.users.beans.User;
import portal.models.components.ProductInfoModel;

import java.util.Date;
import java.util.List;

public interface UserDAO {

    boolean addNewUser(String email, String pass);

    boolean updateSeller(String email, Date birthday, int age , String firstName, String lastName, String phoneNumber, String sex,List<ProductInfoModel> productInfoModels);

    boolean updateUser(String email, Date birthday, int age , String firstName, String lastName, String phoneNumber, String sex,List<ProductInfoModel> productInfoModels, List<Comment> commentList);

    boolean deleteUser(String email);

    boolean addNewSeller(String email, String pass);

    void addVerifyStatus(String email);

    boolean isVerify(String email);

    Seller getSeller(String email);

    User getUser(String email);

}
