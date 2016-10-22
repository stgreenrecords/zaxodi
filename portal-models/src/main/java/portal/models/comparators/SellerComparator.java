package portal.models.comparators;

import portal.models.beans.SellerInfo;

import java.util.Comparator;


public class SellerComparator implements Comparator<SellerInfo> {
    public int compare(SellerInfo firstSeller, SellerInfo secondSeller) {
        return Double.compare(Double.parseDouble(firstSeller.getPrice()), Double.parseDouble(secondSeller.getPrice()));
    }
}
