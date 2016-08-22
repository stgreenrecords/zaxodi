package portal.core.services.users.beans;

import java.util.Date;
import java.util.List;

public class User extends AbstractUser{

    private List<Comment> commentList;

    public User(int age, Date birthday, Date dateOfRegistration, String email, String firstName, String lastName, String phoneNumber, String sex) {
        super(age, birthday, dateOfRegistration, email, firstName, lastName, phoneNumber, sex);
    }


    public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

}
