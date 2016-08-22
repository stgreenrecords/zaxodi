package portal.core.services.users.beans;

import portal.models.components.ProductInfoModel;

import java.util.Date;
import java.util.List;

public class Seller extends AbstractUser {


    private List<ProductInfoModel> productInfoModels;

    public Seller(int age, Date birthday, Date dateOfRegistration, String email, String firstName, String lastName, String phoneNumber, String sex) {
        super(age, birthday, dateOfRegistration, email, firstName, lastName, phoneNumber, sex);
    }
}
