package portal.cms.pipeline.parsers.latest.beans;

/**
 * Created by Studio on 31.12.2016.
 */
public class PropertyModel {

    private String valueSelection;
    private String typeSelection;
    private String exclude;
    private String microdescription;
    private String group;
    private String units;

    public PropertyModel(String valueSelection, String typeSelection, String exclude, String microdescription, String group, String units) {
        this.valueSelection = valueSelection;
        this.typeSelection = typeSelection;
        this.exclude = exclude;
        this.microdescription = microdescription;
        this.group = group;
        this.units = units;
    }

    public String getValueSelection() {
        return valueSelection;
    }

    public void setValueSelection(String valueSelection) {
        this.valueSelection = valueSelection;
    }

    public String getTypeSelection() {
        return typeSelection;
    }

    public void setTypeSelection(String typeSelection) {
        this.typeSelection = typeSelection;
    }

    public String getExclude() {
        return exclude;
    }

    public void setExclude(String exclude) {
        this.exclude = exclude;
    }

    public String getMicrodescription() {
        return microdescription;
    }

    public void setMicrodescription(String microdescription) {
        this.microdescription = microdescription;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }
}
