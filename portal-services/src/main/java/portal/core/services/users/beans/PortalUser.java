package portal.core.services.users.beans;

import java.util.Date;
import java.util.List;

public class PortalUser extends AbstractUser{

    private List<Comment> commentList;

    public PortalUser(int age, Date birthday, Date dateOfRegistration, String email, String firstName, String lastName, String phoneNumber, String sex) {
        super(age, birthday, dateOfRegistration, email, firstName, lastName, phoneNumber, sex);
    }

    public PortalUser(){

    }


    public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

}
