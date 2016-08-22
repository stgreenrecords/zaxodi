package portal.core.services.users.beans;


import java.util.Date;

public class Seller extends AbstractUser {


    public Seller(int age, Date birthday, Date dateOfRegistration, String email, String firstName, String lastName, String phoneNumber, String sex) {
        super(age, birthday, dateOfRegistration, email, firstName, lastName, phoneNumber, sex);
    }
}
