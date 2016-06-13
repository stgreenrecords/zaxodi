package portal.core.model;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Viachaslau_Karnausha on 9/23/2015.
 */
public class SortParameters {

    private String propertyType;
    private Set<String> valueList;
    private String units;
    private int count;

    public SortParameters() {
        valueList = new HashSet();
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public Set<String> getValueList() {
        return valueList;
    }

    public void setValueList(Set valueList) {
        this.valueList = valueList;
    }

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

}

