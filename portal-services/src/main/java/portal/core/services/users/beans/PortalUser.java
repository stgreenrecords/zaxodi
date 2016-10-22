package portal.core.services.users.beans;

import portal.core.services.product.PortalProduct;

import java.util.Date;
import java.util.List;

public class PortalUser extends AbstractUser {

    private List<Comment> commentList;

    private List<PortalProduct> productList;

    public PortalUser(int age, Date birthday, Date dateOfRegistration, String email, String firstName, String lastName, String phoneNumber, String sex) {
        super(age, birthday, dateOfRegistration, email, firstName, lastName, phoneNumber, sex);
    }

    public PortalUser() {

    }

    public List<PortalProduct> getProductList() {
        return productList;
    }

    public void setProductList(List<PortalProduct> productList) {
        this.productList = productList;
    }

    public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

}
