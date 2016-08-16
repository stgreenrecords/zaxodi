package portal.models.components;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import portal.models.BaseModel;
import portal.models.Constants;
import portal.models.beans.ProductInfoProperty;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import java.util.*;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import portal.models.beans.SellerInfo;
import portal.models.beans.SimplePageBean;

@Model(adaptables = Resource.class)
public class ProductInfoModel extends BaseModel {

    public ProductInfoModel(Resource resource) {
        super(resource);
    }

    public List<ProductInfoProperty> getItemProperties() {
        String resultProperty = getComponentProperties().get(Constants.CATALOG_PRODUCT_INFO_PROPERTY_RESULTS, String.class);
        return parseResult(resultProperty);
    }

    public static List<ProductInfoProperty> parseResult(String resultProperty) {
        List<ProductInfoProperty> mainPropertyList = new ArrayList<ProductInfoProperty>();
        JsonParser jsonParser = new JsonParser();
        JsonArray array = (JsonArray) jsonParser.parse(resultProperty);
        for (JsonElement jsonElement : array) {
            JsonObject jsonObject = jsonElement.getAsJsonObject();
            String propertyName = jsonObject.has(Constants.CATALOG_PRODUCT_INFO_PROPERTY_NAME) ? jsonObject.get(Constants.CATALOG_PRODUCT_INFO_PROPERTY_NAME).getAsString() : "error parse property name";
            String propertyValue = jsonObject.has(Constants.CATALOG_PRODUCT_INFO_PROPERTY_VALUE) ? jsonObject.get(Constants.CATALOG_PRODUCT_INFO_PROPERTY_VALUE).getAsString() : "error parse property value";
            String propertyType = jsonObject.has(Constants.CATALOG_PRODUCT_INFO_PROPERTY_TYPE) ? jsonObject.get(Constants.CATALOG_PRODUCT_INFO_PROPERTY_TYPE).getAsString() : "error parse property type";
            String propertyUnits = jsonObject.has(Constants.CATALOG_PRODUCT_INFO_PROPERTY_INITS) ? jsonObject.get(Constants.CATALOG_PRODUCT_INFO_PROPERTY_INITS).getAsString() : null;
            mainPropertyList.add(new ProductInfoProperty(propertyName, propertyValue, propertyType, propertyUnits));
        }
        return mainPropertyList;
    }

    public String getImgPath() {
        Resource image = selfResource.getChild(Constants.COMPONENT_IMAGE_NODE_NAME);
        return image != null ? image.getValueMap().get(Constants.COMPONENT_IMAGE_REFERENCE_PROPERTY, String.class) : StringUtils.EMPTY;
    }

    public Iterator<SimplePageBean> getParentList() {
        Deque<SimplePageBean> simplePageBeanStack = new ArrayDeque<SimplePageBean>();
        Page parent = getOwnPage().getParent();
        while (!parent.getPath().equals(Constants.CATALOG_ROOT_PAGE_PATH)) {
            simplePageBeanStack.add(new SimplePageBean(parent.getPath(), parent.getTitle()));
            parent = parent.getParent();
        }
        return simplePageBeanStack.descendingIterator();
    }


    public List<SellerInfo> getSellerInfo() {
        String[] propertySellerArray = null;
        Object sellerProperty = getComponentProperties().get(Constants.CATALOG_PRODUCT_INFO_PROPERTY_SELLER);
        if (sellerProperty != null && sellerProperty.getClass() == new String[]{}.getClass()) {
            propertySellerArray = (String[]) sellerProperty;
        } else {
            if (sellerProperty != null && sellerProperty instanceof String) {
                propertySellerArray = new String[]{(String) sellerProperty};
            }
        }

        return parseSellerProperty(propertySellerArray, getSession());
    }

    public static List<SellerInfo> parseSellerProperty(String[] sellerPropertyArray, Session session) {
        List<SellerInfo> mainPropertyList = new ArrayList<SellerInfo>();
        if (sellerPropertyArray != null) {
            for (String sellerProperty : sellerPropertyArray) {
                List<String> propertyList;
                JsonParser jsonParser = new JsonParser();
                JsonObject jsonObject = (JsonObject) jsonParser.parse(sellerProperty);
                String propertySellerID = jsonObject.has("sellerID") ? jsonObject.get("sellerID").getAsString() : "error parse property sellerID";
                String propertyPrice = jsonObject.has("price") ? jsonObject.get("price").getAsString() : "error parse property price";
                propertyList = new ArrayList<String>();
                propertyList.add(propertySellerID);
                propertyList.add(propertyPrice);
                int rating = 0;
                try {
                    Node sellerProfileNode = session.getNode("/home/users/portal/" + propertySellerID + "/profile");
                    if (sellerProfileNode.hasProperty("rating")) {
                        rating = (int) sellerProfileNode.getProperty("rating").getValue().getLong();
                    }
                } catch (RepositoryException e) {

                }
                mainPropertyList.add(new SellerInfo(propertyPrice, rating, propertySellerID));

            }
        } else {
            return null;
        }
        return mainPropertyList;
    }

    public static List<SellerInfo> parseSellerProperty(Value[] sellerPropertyArray, Session session) {
        List<SellerInfo> mainPropertyList = new ArrayList<SellerInfo>();
        if (sellerPropertyArray != null) {
            for (Value sellerProperty : sellerPropertyArray) {
                List<String> propertyList;
                JsonParser jsonParser = new JsonParser();
                JsonObject jsonObject = null;
                try {
                    jsonObject = (JsonObject) jsonParser.parse(sellerProperty.getString());
                } catch (RepositoryException e) {
                    e.printStackTrace();
                }
                String propertySellerID = jsonObject.has("sellerID") ? jsonObject.get("sellerID").getAsString() : "error parse property sellerID";
                String propertyPrice = jsonObject.has("price") ? jsonObject.get("price").getAsString() : "error parse property price";
                propertyList = new ArrayList<String>();
                propertyList.add(propertySellerID);
                propertyList.add(propertyPrice);
                int rating = 0;
                try {
                    Node sellerProfileNode = session.getNode("/home/users/portal/" + propertySellerID + "/profile");
                    if (sellerProfileNode.hasProperty("rating")) {
                        rating = (int) sellerProfileNode.getProperty("rating").getValue().getLong();
                    }
                } catch (RepositoryException e) {

                }
                mainPropertyList.add(new SellerInfo(propertyPrice, rating, propertySellerID));

            }
        } else {
            return null;
        }
        return mainPropertyList;
    }

    public List<String> getPhotosList(){
        List<String> photosList = new ArrayList<String>();
        String associatedDAMPath = getCurrentPage().getPath().replace("/content","/content/dam");
        Resource associatedDAMResource = getResourceResolver().getResource(associatedDAMPath);
        for (Resource resource : associatedDAMResource.getChildren()){
            if (!resource.getName().equals(JcrConstants.JCR_CONTENT)) {
                photosList.add(resource.getPath());
            }
        }
        return photosList;
    }

}
