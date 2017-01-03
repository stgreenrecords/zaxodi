package portal.cms.pipeline.parsers.latest.beans;

public class ProductItems {

    private String microDescription;
    private String pathToProduct;
    private String imagePath;
    private String productName;
    private String productTitle;


    public ProductItems(String imagePath, String microDescription, String pathToProduct, String productName, String productTitle) {
        this.imagePath = imagePath;
        this.microDescription = microDescription;
        this.pathToProduct = pathToProduct;
        this.productName = productName;
        this.productTitle = productTitle;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getMicroDescription() {
        return microDescription;
    }

    public void setMicroDescription(String microDescription) {
        this.microDescription = microDescription;
    }

    public String getPathToProduct() {
        return pathToProduct;
    }

    public void setPathToProduct(String pathToProduct) {
        this.pathToProduct = pathToProduct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProductItems that = (ProductItems) o;

        if (microDescription != null ? !microDescription.equals(that.microDescription) : that.microDescription != null)
            return false;
        if (pathToProduct != null ? !pathToProduct.equals(that.pathToProduct) : that.pathToProduct != null)
            return false;
        if (imagePath != null ? !imagePath.equals(that.imagePath) : that.imagePath != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = microDescription != null ? microDescription.hashCode() : 0;
        result = 31 * result + (pathToProduct != null ? pathToProduct.hashCode() : 0);
        result = 31 * result + (imagePath != null ? imagePath.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Product:" +
                "imagePath='" + imagePath + '\'' +
                ", microDescription='" + microDescription + '\'' +
                ", pathToProduct='" + pathToProduct + '\'' +
                '\n';
    }
}
