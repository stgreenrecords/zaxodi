package portal.models.beans;

/**
 * Created by STUDIO on 06.09.2015.
 */
public class ProductInfoProperty {

    private String propertyName;
    private String propertyValue;
    private String propertyType;
    private String propertyUnits;
    private int count;

    public ProductInfoProperty() {
    }

    public ProductInfoProperty(String propertyName, String propertyValue, String propertyType, String propertyUnits) {
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
        this.propertyType = propertyType;
        this.propertyUnits = propertyUnits;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getPropertyValue() {
        return propertyValue;
    }

    public void setPropertyValue(String propertyValue) {
        this.propertyValue = propertyValue;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getPropertyUnits() {
        return propertyUnits;
    }

    public void setPropertyUnits(String propertyUnits) {
        this.propertyUnits = propertyUnits;
    }

    public int getCount() {
        if (propertyValue.contains("true")) {
            try {
                count = Integer.parseInt(propertyValue.split(",")[1]);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
