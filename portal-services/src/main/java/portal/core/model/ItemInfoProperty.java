package portal.core.model;

public class ItemInfoProperty {

    private String propertyName;
    private String propertyValue;
    private String propertyType;
    private String propertyUnits;
    private String propertyGroup;
    private boolean propertyExclude;
    private int count;

    public ItemInfoProperty() {
    }

    public ItemInfoProperty(String propertyName, String propertyValue, String propertyType, String propertyUnits, String propertyGroup, boolean propertyExclude) {
        this.propertyName = propertyName;
        this.propertyValue = propertyValue;
        this.propertyType = propertyType;
        this.propertyUnits = propertyUnits;
        this.propertyGroup = propertyGroup;
        this.propertyExclude = propertyExclude;
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

    public boolean isPropertyExclude() {
        return propertyExclude;
    }

    public void setPropertyExclude(boolean propertyExclude) {
        this.propertyExclude = propertyExclude;
    }

    public String getPropertyGroup() {
        return propertyGroup;
    }

    public void setPropertyGroup(String propertyGroup) {
        this.propertyGroup = propertyGroup;
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
