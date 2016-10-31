package portal.core.servlets;

import com.day.cq.wcm.api.NameConstants;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.model.ItemInfoProperty;
import portal.core.model.SortParameters;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/productlist")
})
public class ProductListHelper extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(ProductListHelper.class);

    private Map<String, SortParameters> sortParametersMap = new HashMap<String, SortParameters>();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        JsonObject resultJsonObject = getDataFromRequest(request);
        if (resultJsonObject != null) {
            response.setCharacterEncoding(Constants.CHARSET_UTF_8);
            PrintWriter writer = response.getWriter();
            writer.print(resultJsonObject.toString());
        }
    }

    private JsonObject getDataFromRequest(SlingHttpServletRequest request) {
        JsonObject resultJsonObject = null;
        String currentPath = request.getHeader(Constants.STRING_REQUEST_CATEGORY_PATH);
        LOG.info("COLLECT INFORMATION FROM : " + currentPath);
        if (currentPath != null) {
            try {
                NodeIterator categoryNodeIterator = request.getResourceResolver().getResource(currentPath).adaptTo(Node.class).getNodes();
                resultJsonObject = new JsonObject();
                JsonArray itemsArray = new JsonArray();
                while (categoryNodeIterator.hasNext()) {
                    Node itemNode = categoryNodeIterator.nextNode();
                    if (itemNode.hasProperty(Constants.JCR_PRIMARY_TYPE) && itemNode.getProperty(Constants.JCR_PRIMARY_TYPE).getString().equals(NameConstants.NT_PAGE)) {
                        JsonParser jsonParser = new JsonParser();
                        Node catalogItemInfoNode = itemNode.getNode(Constants.PATH_TO_COMPONENT_CATALOG_ITEM_INFO);
                        if (catalogItemInfoNode != null) {
                            if (catalogItemInfoNode.hasProperty(Constants.PROPERTY_RESULTS)) {
                                JsonObject itemObject = new JsonObject();
                                itemObject.addProperty(Constants.STRING_PATH, itemNode.getPath());
                                if (catalogItemInfoNode.hasProperty(Constants.NODE_PROPERTY_BRAND)) {
                                    itemObject.addProperty(Constants.NODE_PROPERTY_BRAND, catalogItemInfoNode.getProperty(Constants.NODE_PROPERTY_BRAND).getString());

                                }
                                if (catalogItemInfoNode.hasProperty(Constants.NODE_PROPERTY_MODEL)) {
                                    itemObject.addProperty(Constants.NODE_PROPERTY_MODEL, catalogItemInfoNode.getProperty(Constants.NODE_PROPERTY_MODEL).getString());
                                }
                                int price = minimalPriceFromNode(catalogItemInfoNode);
                                if (price > 0) {
                                    itemObject.addProperty(Constants.NODE_PROPERTY_PRICE, price);
                                }
                                JsonArray array = (JsonArray) jsonParser.parse(catalogItemInfoNode.getProperty(Constants.PROPERTY_RESULTS).getString());
                                if (array != null) {
                                    itemObject.add(Constants.NODE_PROPERTY_PROPERTIES, array);
                                    itemsArray.add(itemObject);
                                    collectFilterPropertiesFromJsonArray(array);
                                }

                                if (catalogItemInfoNode.hasNode(Constants.NODE_IMAGE)) {
                                    Node imageNode = catalogItemInfoNode.getNode(Constants.NODE_IMAGE);
                                    String linkToImage = imageNode.hasProperty(Constants.IMAGE_PROPERTY_FILE_REFERENCE) ? imageNode.getProperty(Constants.IMAGE_PROPERTY_FILE_REFERENCE).getString() : StringUtils.EMPTY;
                                    itemObject.addProperty(Constants.NODE_IMAGE, linkToImage);
                                }
                            }
                        }
                    }
                }
                JsonArray filterResults = parseSortMap();
                if (filterResults.size() > 0) {
                    resultJsonObject.add(Constants.JSON_FILTER_PROPERTIES, filterResults);
                }
                resultJsonObject.add(Constants.JSON_ITEMS, itemsArray);
            } catch (RepositoryException e) {
                LOG.error(e.getMessage());
            }

        }
        sortParametersMap.clear();
        return resultJsonObject;
    }

    private JsonArray parseSortMap() {
        JsonArray filtersArray = new JsonArray();
        for (Map.Entry<String, SortParameters> sortParametersEntry : sortParametersMap.entrySet()) {
            JsonObject filter = new JsonObject();
            String filterType = sortParametersEntry.getValue().getPropertyType();
            filter.addProperty(Constants.STRING_FILTER_TYPE, filterType);
            filter.addProperty(Constants.STRING_FILTER_NAME, sortParametersEntry.getKey());
            if (filterType.equals(Constants.FILTER_TYPE_ATTITUDE)
                    || filterType.equals(Constants.FILTER_TYPE_INTERVAL)
                    || filterType.equals(Constants.FILTER_TYPE_SIZE)
                    || filterType.equals(Constants.FILTER_TYPE_ENUM)
                    || filterType.equals(Constants.FILTER_TYPE_SIMPLETEXT)
                    ) {
                JsonArray valueListArray = new JsonArray();
                for (String value : sortParametersEntry.getValue().getValueList()) {
                    JsonObject valueElement = new JsonObject();
                    valueElement.addProperty(Constants.JSON_VALUE, value);
                    valueListArray.add(valueElement);
                }
                if (valueListArray.size() > 0) {
                    filter.add(Constants.JSON_VALUES, valueListArray);
                }
                if (sortParametersEntry.getValue().getUnits() != null && !StringUtils.EMPTY.equals(sortParametersEntry.getValue().getUnits())) {
                    filter.addProperty(Constants.STRING_UNITS, sortParametersEntry.getValue().getUnits());
                }
            }
            if (sortParametersEntry.getValue().getCount() > 0) {
                filter.addProperty(Constants.STRING_FILTER_COUNT, sortParametersEntry.getValue().getCount());
            }

            filtersArray.add(filter);
        }
        return filtersArray;
    }

    private void collectFilterPropertiesFromJsonArray(JsonArray array) {
        for (JsonElement jsonElement : array) {
            JsonObject jsonObject = jsonElement.getAsJsonObject();
            String propertyName = jsonObject.has(Constants.STRING_PROPERTY_NAME) ? jsonObject.get(Constants.STRING_PROPERTY_NAME).getAsString() : "error parse property name";
            String propertyValue = jsonObject.has(Constants.STRING_PROPERTY_VALUE) ? jsonObject.get(Constants.STRING_PROPERTY_VALUE).getAsString() : "error parse property value";
            String propertyType = jsonObject.has(Constants.STRING_PROPERTY_TYPE) ? jsonObject.get(Constants.STRING_PROPERTY_TYPE).getAsString() : "error parse property type";
            String propertyUnits = jsonObject.has(Constants.STRING_UNITS) ? jsonObject.get(Constants.STRING_UNITS).getAsString() : null;
            ItemInfoProperty itemInfoProperty = new ItemInfoProperty(propertyName, propertyValue, propertyType, propertyUnits);
            if (sortParametersMap.containsKey(itemInfoProperty.getPropertyName())) {
                if (itemInfoProperty.getPropertyType().equals(Constants.FILTER_TYPE_ENUM)) {
                    String[] enumArray = itemInfoProperty.getPropertyValue().split(",");
                    for (String enumItem : enumArray) {
                        sortParametersMap.get(itemInfoProperty.getPropertyName()).getValueList().add(enumItem);
                    }
                } else {
                    int count = 0;
                    if (propertyType.equals(Constants.FILTER_TYPE_NUMBER_BOOLEAN)) {
                        count = propertyValue.contains(Constants.PROPERTY_TRUE) ? Integer.parseInt(propertyValue.split(",")[1]) : 0;
                        int currentCount = sortParametersMap.get(itemInfoProperty.getPropertyName()).getCount();
                        if (currentCount == 0 || currentCount < count) {
                            sortParametersMap.get(itemInfoProperty.getPropertyName()).setCount(count);
                        }
                    }
                    sortParametersMap.get(itemInfoProperty.getPropertyName()).getValueList().add(itemInfoProperty.getPropertyValue());
                }
            } else {
                if (itemInfoProperty.getPropertyType().equals(Constants.FILTER_TYPE_ENUM)) {
                    String[] enumArray = itemInfoProperty.getPropertyValue().split(Constants.COMMA);
                    SortParameters sortParameters = new SortParameters();
                    sortParameters.setUnits(itemInfoProperty.getPropertyUnits());
                    sortParameters.setPropertyType(itemInfoProperty.getPropertyType());
                    for (String enumItem : enumArray) {
                        sortParameters.getValueList().add(enumItem);
                    }
                    sortParametersMap.put(itemInfoProperty.getPropertyName(), sortParameters);
                } else {
                    SortParameters sortParameters = new SortParameters();
                    sortParameters.setUnits(itemInfoProperty.getPropertyUnits());
                    sortParameters.setPropertyType(itemInfoProperty.getPropertyType());
                    sortParameters.getValueList().add(itemInfoProperty.getPropertyValue());
                    if (propertyType.equals(Constants.FILTER_TYPE_NUMBER_BOOLEAN)) {
                        int count = propertyValue.contains(Constants.PROPERTY_TRUE) ? Integer.parseInt(propertyValue.split(",")[1]) : 0;
                        if (count > 0) {
                            sortParameters.setCount(count);
                        }
                    }
                    sortParametersMap.put(itemInfoProperty.getPropertyName(), sortParameters);
                }
            }
        }
    }

    private int minimalPriceFromNode(Node contentNode) throws RepositoryException {
        if (contentNode.hasProperty(Constants.NODE_PROPERTY_SELLER)) {
            Value[] sellerArray = null;
            if (contentNode.getProperty(Constants.NODE_PROPERTY_SELLER).isMultiple()) {
                sellerArray = contentNode.getProperty(Constants.NODE_PROPERTY_SELLER).getValues();
            } else {
                sellerArray = new Value[]{contentNode.getProperty(Constants.NODE_PROPERTY_SELLER).getValue()};
            }
            int minPrice = 0;
            int count = 0;
            for (Value value : sellerArray) {
                String jsonSeller = value.getString();
                JsonParser jsonParser = new JsonParser();
                JsonObject jsonObject = (JsonObject) jsonParser.parse(jsonSeller);
                String propertyPrice = jsonObject.has(Constants.NODE_PROPERTY_PRICE) ? jsonObject.get(Constants.NODE_PROPERTY_PRICE).getAsString() : "0";
                int currentPrice = 0;
                try {
                    currentPrice = Integer.parseInt(propertyPrice);
                } catch (NumberFormatException e) {
                    LOG.error(e.getMessage());
                }
                if (currentPrice < minPrice) {
                    minPrice = currentPrice;
                }
                if (count == 0) {
                    minPrice = currentPrice;
                    count++;
                }
            }
            return minPrice;
        }
        return 0;
    }

}
