package portal.core.services.product;

import com.adobe.cq.commerce.api.CommerceException;
import com.adobe.cq.commerce.api.Product;
import com.adobe.cq.commerce.api.VariantFilter;
import com.day.cq.commons.ImageResource;
import org.apache.sling.api.resource.Resource;

import java.util.Iterator;
import java.util.List;

/**
 * Created by Студия on 04.10.2016.
 */
public class PortalProduct implements Product {

    public String getPath() {
        return null;
    }

    public String getPagePath() {
        return null;
    }

    public String getSKU() {
        return null;
    }

    public String getTitle() {
        return null;
    }

    public String getTitle(String s) {
        return null;
    }

    public String getDescription() {
        return null;
    }

    public String getDescription(String s) {
        return null;
    }

    public String getThumbnailUrl() {
        return null;
    }

    public String getThumbnailUrl(int i) {
        return null;
    }

    public String getThumbnailUrl(String s) {
        return null;
    }

    public Resource getAsset() {
        return null;
    }

    public List<Resource> getAssets() {
        return null;
    }

    public ImageResource getImage() {
        return null;
    }

    public List<ImageResource> getImages() {
        return null;
    }

    public <T> T getProperty(String s, Class<T> aClass) {
        return null;
    }

    public <T> T getProperty(String s, String s1, Class<T> aClass) {
        return null;
    }

    public Iterator<String> getVariantAxes() {
        return null;
    }

    public boolean axisIsVariant(String s) {
        return false;
    }

    public Iterator<Product> getVariants() throws CommerceException {
        return null;
    }

    public Iterator<Product> getVariants(VariantFilter variantFilter) throws CommerceException {
        return null;
    }

    public Product getBaseProduct() throws CommerceException {
        return null;
    }

    public Product getPIMProduct() throws CommerceException {
        return null;
    }

    public String getImageUrl() {
        return null;
    }

    public String getImagePath() {
        return null;
    }

    public ImageResource getThumbnail() {
        return null;
    }

    public <AdapterType> AdapterType adaptTo(Class<AdapterType> aClass) {
        return null;
    }
}
