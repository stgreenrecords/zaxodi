package portal.models.beans;

/**
 * Created by Viachaslau_Karnausha on 9/9/2015.
 */
public class SellerInfo {

    private String price;
    private int rating;
    private String sellerID;

    public SellerInfo(String price, int rating, String sellerID) {
        this.price = price;
        this.rating = rating;
        this.sellerID = sellerID;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getSellerID() {
        return sellerID;
    }

    public void setSellerID(String sellerID) {
        this.sellerID = sellerID;
    }
}
