package portal.core.data;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Constants class for PORTAL Core
 */
public class Constants {
    private Constants() {
    }

    public static final String PATH_SEPARATOR = "/";
    public static final String QUESTION_MARK = "?";
    public static final String EQUALS = "=";
    public static final String COMMA = ",";
    public static final String DOT = ".";

    public static final String CHARSET_UTF_8 = "UTF-8";

    public static final String DEFAULT_LANG = "en";
    public static final Locale DEFAULT_LOCALE = new Locale(DEFAULT_LANG);
    public static final Pattern LOCALE_PATTERN = Pattern.compile("/[^/]*/[^/]*/(\\w*)(/|\\.html)");

    public static final String PATH_TO_LOCALES = "/etc/languages";
    public static final String LOCALES_PROPERTY = "languages";
    public static final String[] EMPTY_STRING_ARRAY = {};

    public static final String LANDING_PAGE_RESOURCE_TYPE = "portal/pages/portal-landing-page";
    public static final String CQ_SCAFFOLDING_PROP = "jcr:content/cq:scaffolding";

    public static final String CONTENT_PATH = "/content";

    public static final String HTML_EXTENSION = ".html";

    public static final String JCR_PRIMARY_TYPE = "jcr:primaryType";

    public static final String PATH_TO_COMPONENT_CATALOG_ITEM_INFO = "jcr:content/columns/parsys0/productinfo";

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
    public static final String NODE_PROPERTY_PROPERTIES = "properties";

    public static final String JSON_FILTER_PROPERTIES = "filterProperties";
    public static final String JSON_ITEMS = "items";
    public static final String JSON_VALUE = "value";
    public static final String JSON_VALUES = "values";

    public static final String NODE_IMAGE = "image";

    public static final String STRING_PROPERTY_NAME = "propertyName";
    public static final String STRING_PROPERTY_VALUE = "propertyValue";
    public static final String STRING_PROPERTY_TYPE = "propertyType";
    public static final String STRING_UNITS = "units";

    public static final String STRING_FILTER_TYPE = "filterType";
    public static final String STRING_FILTER_NAME = "filterName";
    public static final String STRING_FILTER_COUNT = "count";
    public static final String STRING_PATH = "path";
    public static final String STRING_REQUEST_CATEGORY_PATH = "categoryPath";

    public static final String ROOT_PAGE = "/content/portal.html";

    public static final String RE_CAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

    public static final String RE_CAPTCHA_REQUEST_PARAMETER = "responseFromCaptcha";

    public static final String STATUS_REGISTRATION_SUCCESS = "registrationSuccess";

    public static final String STATUS_USER_DOESNOT_EXIST = "user with that name doesn't exist";

    public static final String STATUS_USER_IS_INVALID = "please see you mail and follow to the instructions";

    public static final String STATUS_WRONG_PASS = "wrong password";

    public static final String STATUS_REGISTRATION_FAIL = "registrationFail";




}
