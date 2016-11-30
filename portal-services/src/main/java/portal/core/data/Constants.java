package portal.core.data;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Constants class for PORTAL Core
 */
public class Constants {
    private Constants() {
    }

    public static final String COMMA = ",";

    public static final String CHARSET_UTF_8 = "UTF-8";


    public static final String CATALOG_PATH = "/content/portal/catalog";


    public static final String PROPERTY_RESULTS = "results";
    public static final String PROPERTY_TRUE = "true";

    public static final String IMAGE_PROPERTY_FILE_REFERENCE = "fileReference";


    public static final String FILTER_TYPE_SIMPLETEXT = "simpletext";
    public static final String FILTER_TYPE_ATTITUDE = "attitude";
    public static final String FILTER_TYPE_INTERVAL = "interval";
    public static final String FILTER_TYPE_SIZE = "size";
    public static final String FILTER_TYPE_ENUM = "enum";
    public static final String FILTER_TYPE_NUMBER_BOOLEAN = "numberBoolean";

    public static final String NODE_PROPERTY_SELLER = "seller";
    public static final String NODE_PROPERTY_PRICE = "price";
    public static final String NODE_PROPERTY_BRAND = "brand";
    public static final String NODE_PROPERTY_MODEL = "model";
    public static final String NODE_PROPERTY_DESCRIPTION = "discription";
    public static final String NODE_PROPERTY_PROPERTIES = "properties";

    public static final String JSON_FILTER_PROPERTIES = "filterProperties";
    public static final String JSON_ITEMS = "items";
    public static final String JSON_VALUE = "value";
    public static final String JSON_VALUES = "values";

    public static final String NODE_IMAGE = "image";

    public static final String STRING_PROPERTY_NAME = "name";
    public static final String STRING_PROPERTY_VALUE = "value";
    public static final String STRING_PROPERTY_TYPE = "type";
    public static final String STRING_UNITS = "units";
    public static final String STRING_PROPERTY_GROUP = "group";
    public static final String STRING_PROPERTY_EXCLUDE = "exclude";

    public static final String STRING_FILTER_COUNT = "count";
    public static final String STRING_PATH = "path";
    public static final String STRING_REQUEST_CATEGORY_PATH = "categoryPath";

    public static final String RE_CAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

    public static final String RE_CAPTCHA_REQUEST_PARAMETER = "responseFromCaptcha";

    public static final String STATUS_REGISTRATION_SUCCESS = "registrationSuccess";

    public static final String STATUS_USER_DOESNOT_EXIST = "user with that name doesn't exist";

    public static final String STATUS_USER_IS_INVALID = "please see you mail and follow to the instructions";

    public static final String STATUS_WRONG_PASS = "wrong password";

    public static final String STATUS_SUCCESS_LOGIN = "successLogin";

    public static final String STATUS_REGISTRATION_FAIL = "registrationFail";

    public static final String AUTH_COOKIE_NAME = "portal-session-id";

    public static final String EMAIL_COOKIE_NAME = "portal-user";

    public static final int LOGIN_COOKIE_AGE = 60 * 60 * 24 * 60;

    public static final String BASKET_PLACED_PROPERTY = "basketPlaced";

    public static final String COMPONENT_IMAGE_NODE_NAME = "image";

    public static final String COMPONENT_IMAGE_REFERENCE_PROPERTY = "fileReference";

    public static final String COMPONENT_SLIDER_EVENT_PROPERTY = "pathToAction";

    public static final String COMPONENT_SLIDER_ALIGN_PROPERTY = "align";

    public static final String COMPONENT_SLIDER_TITLE_PROPERTY = "buttonTitle";

    public static final String COMPONENT_PROMO_PATH_PROPERTY = "path";

    public static final String COMPONENT_PROMO_TITLE_TOP_PROPERTY = "titleTop";

    public static final String COMPONENT_PROMO_TITLE__BOTTOM_PROPERTY = "titleBottom";

    public static final String RICH_TEXT_PROPERTY = "text";

    public static final String RESOURCE_TYPE__NAVIGATION = "portal/components/structure/topnav";

    public static final String RESOURCE_TYPE__FOOTER = "portal/components/structure/footer";

    public static final String CATALOG_ROOT_PAGE_PATH = "/content/portal/catalog";

    public static final String CATALOG_ITEM_LIST_PATH = "portal/components/catalog/productList";

    public static final String CATALOG_PRODUCT_INFO_PROPERTY_RESULTS = "results";
    public static final String CATALOG_PRODUCT_INFO_PROPERTY_SELLER = "seller";

    public static final String RESOURCE_TYPE_CQ_PAGE = "cq:Page";

    public static final String SUBCATEGORY_PROPERTY = "subCategory";


}
