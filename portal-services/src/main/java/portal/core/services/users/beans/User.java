package portal.core.services.users.beans;

import portal.models.components.ProductInfoModel;

import java.util.Date;
import java.util.List;

public class User extends AbstractUser{

    private List<Comment> commentList;
    private List<ProductInfoModel> favoriteProductsList;

    public User(int age, Date birthday, Date dateOfRegistration, String email, String firstName, String lastName, String phoneNumber, String sex) {
        super(age, birthday, dateOfRegistration, email, firstName, lastName, phoneNumber, sex);
    }


    public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

    public List<ProductInfoModel> getFavoriteProductsList() {
        return favoriteProductsList;
    }

    public void setFavoriteProductsList(List<ProductInfoModel> favoriteProductsList) {
        this.favoriteProductsList = favoriteProductsList;
    }
}
