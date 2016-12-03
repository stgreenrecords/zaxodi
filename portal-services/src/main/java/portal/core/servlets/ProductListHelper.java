package portal.core.servlets;

import com.day.cq.wcm.api.Page;
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
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.data.Constants;
import portal.core.model.ItemInfoProperty;
import portal.core.model.SortParameters;

import javax.jcr.RepositoryException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/productlist")
})
public class ProductListHelper extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(ProductListHelper.class);

    //<Group, <FilterName, FilterProperties>>
    private Map<String, Map<String, SortParameters>> sortParametersMap = new LinkedHashMap<String, Map<String, SortParameters>>();

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
                Iterator<Page> categoryPageIterator = request.getResourceResolver().getResource(currentPath).adaptTo(Page.class).listChildren();
                resultJsonObject = new JsonObject();
                JsonArray itemsArray = new JsonArray();
                while (categoryPageIterator.hasNext()) {
                    Iterator<Page> brandIterator = categoryPageIterator.next().listChildren();
                    while (brandIterator.hasNext()) {
                        Page productPage = brandIterator.next();
                        JsonParser jsonParser = new JsonParser();
                        ValueMap productPageProperties = productPage.getProperties();
                        if (productPageProperties.containsKey(Constants.PROPERTY_RESULTS)) {
                            JsonObject mainObject = new JsonObject();
                            mainObject.addProperty(Constants.NODE_PROPERTY_MICRO_DESCRIPTION, productPageProperties.containsKey(Constants.NODE_PROPERTY_MICRO_DESCRIPTION) ?
                                    productPageProperties.get(Constants.NODE_PROPERTY_MICRO_DESCRIPTION, String.class) : StringUtils.EMPTY);
                            mainObject.addProperty(Constants.STRING_PATH, productPage.getPath());
                            String brand = productPageProperties.containsKey(Constants.NODE_PROPERTY_BRAND) ?
                                    productPageProperties.get(Constants.NODE_PROPERTY_BRAND, String.class) : productPage.getParent().getTitle();
                            String model = productPageProperties.containsKey(Constants.NODE_PROPERTY_MODEL) ?
                                    productPageProperties.get(Constants.NODE_PROPERTY_MODEL, String.class) : productPage.getTitle();
                            mainObject.addProperty(Constants.NODE_PROPERTY_BRAND, brand);
                            mainObject.addProperty(Constants.NODE_PROPERTY_MODEL, model);
                            int price = minimalPriceFromNode(productPageProperties);
                            if (price > 0) {
                                mainObject.addProperty(Constants.NODE_PROPERTY_PRICE, price);
                            }
                            JsonArray resultArray = (JsonArray) jsonParser.parse(productPageProperties.get(Constants.PROPERTY_RESULTS, String.class));
                            if (resultArray != null) {
                                JsonObject brandToResult = new JsonObject();
                                brandToResult.addProperty(Constants.STRING_PROPERTY_NAME, Constants.NODE_PROPERTY_BRAND);
                                brandToResult.addProperty(Constants.STRING_PROPERTY_TYPE,Constants.FILTER_TYPE_SIMPLETEXT);
                                brandToResult.addProperty(Constants.STRING_PROPERTY_EXCLUDE, true);
                                brandToResult.addProperty(Constants.STRING_PROPERTY_VALUE, brand);
                                resultArray.add(brandToResult);
                                JsonObject priceToResult = new JsonObject();
                                priceToResult.addProperty(Constants.STRING_PROPERTY_NAME, Constants.NODE_PROPERTY_PRICE);
                                priceToResult.addProperty(Constants.STRING_PROPERTY_TYPE,Constants.FILTER_TYPE_FLOAT);
                                priceToResult.addProperty(Constants.STRING_PROPERTY_EXCLUDE, true);
                                priceToResult.addProperty(Constants.STRING_PROPERTY_VALUE, price);
                                resultArray.add(priceToResult);
                                mainObject.add(Constants.NODE_PROPERTY_PROPERTIES, resultArray);
                                itemsArray.add(mainObject);
                                collectFilterPropertiesFromJsonArray(resultArray);
                            }
                            Resource imageResource = productPage.getContentResource().getChild(Constants.NODE_IMAGE);
                            if (imageResource != null) {
                                ValueMap imageValueMap = imageResource.getValueMap();
                                String linkToImage = imageValueMap.containsKey(Constants.IMAGE_PROPERTY_FILE_REFERENCE) ? imageValueMap.get(Constants.IMAGE_PROPERTY_FILE_REFERENCE, String.class) : StringUtils.EMPTY;
                                mainObject.addProperty(Constants.NODE_IMAGE, linkToImage);
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
        for (Map.Entry<String, Map<String, SortParameters>> groupEntry : sortParametersMap.entrySet()) {
            JsonObject group = new JsonObject();
            group.add(groupEntry.getKey(), new JsonArray());
            for (Map.Entry<String, SortParameters> sortParametersEntry : groupEntry.getValue().entrySet()) {
                JsonObject filter = new JsonObject();
                String filterType = sortParametersEntry.getValue().getPropertyType();
                String filterGroup = sortParametersEntry.getValue().getPropertyGroup();
                boolean filterExclude = sortParametersEntry.getValue().isPropertyExclude();
                filter.addProperty(Constants.STRING_PROPERTY_TYPE, filterType);
                filter.addProperty(Constants.STRING_PROPERTY_NAME, sortParametersEntry.getKey());
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
                group.get(groupEntry.getKey()).getAsJsonArray().add(filter);
            }
            filtersArray.add(group);
        }
        return filtersArray;
    }

    private void collectFilterPropertiesFromJsonArray(JsonArray array) {
        for (JsonElement jsonElement : array) {
            JsonObject jsonObject = jsonElement.getAsJsonObject();
            String propertyName = jsonObject.get(Constants.STRING_PROPERTY_NAME).getAsString();
            String propertyValue = jsonObject.get(Constants.STRING_PROPERTY_VALUE).getAsString();
            String propertyType = jsonObject.get(Constants.STRING_PROPERTY_TYPE).getAsString();
            String propertyUnits = jsonObject.has(Constants.STRING_UNITS) ? jsonObject.get(Constants.STRING_UNITS).getAsString() : null;
            String propertyGroup = jsonObject.has(Constants.STRING_PROPERTY_GROUP) ? jsonObject.get(Constants.STRING_PROPERTY_GROUP).getAsString() : StringUtils.EMPTY;
            boolean propertyExclude = jsonObject.has(Constants.STRING_PROPERTY_EXCLUDE) ? jsonObject.get(Constants.STRING_PROPERTY_EXCLUDE).getAsBoolean() : true;
            if (!propertyExclude || propertyName.equals(Constants.NODE_PROPERTY_BRAND) || propertyName.equals(Constants.NODE_PROPERTY_PRICE)) {
                ItemInfoProperty itemInfoProperty = new ItemInfoProperty(propertyName, propertyValue, propertyType, propertyUnits, propertyGroup, propertyExclude);
                if (!sortParametersMap.containsKey(propertyGroup)) {
                    sortParametersMap.put(propertyGroup, new LinkedHashMap<String, SortParameters>());
                }
                if (sortParametersMap.get(propertyGroup).containsKey(itemInfoProperty.getPropertyName())) {
                    if (itemInfoProperty.getPropertyType().equals(Constants.FILTER_TYPE_ENUM)) {
                        String[] enumArray = itemInfoProperty.getPropertyValue().split(",");
                        for (String enumItem : enumArray) {
                            sortParametersMap.get(propertyGroup).get(itemInfoProperty.getPropertyName()).getValueList().add(enumItem);
                        }
                    } else {
                        int count = 0;
                        if (propertyType.equals(Constants.FILTER_TYPE_NUMBER_BOOLEAN)) {
                            count = propertyValue.contains(Constants.PROPERTY_TRUE) ? Integer.parseInt(propertyValue.split(",")[1]) : 0;
                            int currentCount = sortParametersMap.get(propertyGroup).get(itemInfoProperty.getPropertyName()).getCount();
                            if (currentCount == 0 || currentCount < count) {
                                sortParametersMap.get(propertyGroup).get(itemInfoProperty.getPropertyName()).setCount(count);
                            }
                        }
                        sortParametersMap.get(propertyGroup).get(itemInfoProperty.getPropertyName()).getValueList().add(itemInfoProperty.getPropertyValue());
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
                        sortParametersMap.get(propertyGroup).put(itemInfoProperty.getPropertyName(), sortParameters);
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
                        sortParametersMap.get(propertyGroup).put(itemInfoProperty.getPropertyName(), sortParameters);
                    }
                }
            }
        }
    }

    private int minimalPriceFromNode(ValueMap productProperties) throws RepositoryException {
        if (productProperties.containsKey(Constants.NODE_PROPERTY_SELLER)) {
            String[] sellerArray = null;
            Object propertySeller = productProperties.get(Constants.NODE_PROPERTY_SELLER);
            if (propertySeller.getClass() == String[].class) {
                sellerArray = productProperties.get(Constants.NODE_PROPERTY_SELLER, String[].class);
            } else {
                sellerArray = new String[]{productProperties.get(Constants.NODE_PROPERTY_SELLER, String.class)};
            }
            int minPrice = 0;
            int count = 0;
            for (String jsonSeller : sellerArray) {
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
