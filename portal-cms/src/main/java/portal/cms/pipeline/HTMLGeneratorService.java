package portal.cms.pipeline;

import com.day.cq.contentsync.handler.util.RequestResponseFactory;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.WCMMode;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.osgi.PropertiesUtil;
import org.apache.sling.engine.SlingRequestProcessor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/pagegerenation")
})
public class HTMLGeneratorService extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(HTMLGeneratorService.class);

    @Reference
    private QueryBuilder queryBuilder;

    @Reference
    private RequestResponseFactory requestResponseFactory;

    @Reference
    private SlingRequestProcessor requestProcessor;

    @Property
    static final String PATH_TO_FILE_STORE = "path_to_store_html";

    private ResourceResolver resolver;

    private ComponentContext componentContext;

    private SlingHttpServletRequest request;

    @Activate
    protected void activate(ComponentContext componentContext) {
        this.componentContext = componentContext;
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException, ServletException {
        this.request = request;
        try {
            buildSite(request, response);
        } catch (RepositoryException e) {
            LOG.error(e.getMessage());
        }
    }

    private void buildSite(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException, ServletException, RepositoryException {
        LOG.info("START PROCESS GENERATION PAGE. FOLDER FOR STORE SITE : " + getPathToFileStore());
        Map<String, String> htmlMap = parseHTML(request);
        writeMapToFileSystem(htmlMap);
    }

    private void generateClientLibsAndImageFromHTML(String html) throws IOException, ServletException {
        Document document = Jsoup.parse(html);
        Elements cssLibrariesElements = document.getElementsByTag("link");
        Elements jsLibrariesElements = document.select("script[src]");
        Elements imageElements = document.getElementsByTag("img");
        String additionalPathToClientLibs = "/var/clientlibs";
        for (Element cssTag : cssLibrariesElements) {
            String cssPath = cssTag.attr("href");
            String fullCssPath = getPathToFileStore() + cssPath;
            if ((cssPath.startsWith("/etc/") || cssPath.startsWith("/apps/") || cssPath.startsWith("/libs/")) && !new File(fullCssPath).exists()) {
                String cssData = processResource(additionalPathToClientLibs + cssPath);
                checkCssFiles(cssData);
                writeTextFile(fullCssPath, cssData);
            }
        }
        for (Element jsTag : jsLibrariesElements) {
            String jsPath = jsTag.attr("src");
            String fullJsPath = getPathToFileStore() + jsPath;
            if ((jsPath.startsWith("/etc/") || jsPath.startsWith("/apps/") || jsPath.startsWith("/libs/")) && !new File(fullJsPath).exists()) {
                String jsData = processResource(additionalPathToClientLibs + jsPath);
                checkJsFiles(jsData);
                writeTextFile(fullJsPath, jsData);
            }
        }
        for (Element imageTag : imageElements) {
            String pathToImage = imageTag.attr("src");
            processImage(pathToImage);
        }
    }

    private void processImage(String pathToImage) throws IOException {
        String fullImagePath = getPathToFileStore() + pathToImage;
        Resource resource = resolver.getResource(pathToImage);
        Asset image = resource == null ? null : resource.adaptTo(Asset.class);
        if (image != null) {
            Rendition rendition = image.getOriginal();
            byte[] imageBytes = IOUtils.toByteArray(rendition.getStream());
            writeBinaryFile(fullImagePath, imageBytes);
        }
    }

    private void checkCssFiles(String data) throws IOException {
        boolean containDamResources = data.contains("/content/dam");
        while (containDamResources){
            data = data.substring(data.indexOf("/content"),data.length());
            if (data.indexOf(")") > 0) {
                String url = data.substring(0, data.indexOf(")"));
                processImage(url);
                data = data.substring(data.indexOf(")"), data.length());
                containDamResources = data.contains("/content/dam");
            } else {
                containDamResources = false;
            }
        }
    }

    private void checkJsFiles(String data) throws IOException {
        boolean containDamResources = data.contains("/content/dam");
        while (containDamResources){
            data = data.substring(data.indexOf("/content"),data.length());
            if (data.indexOf("'") > 0) {
                String url = data.substring(0, data.indexOf("'"));
                processImage(url);
                data = data.substring(data.indexOf("'"), data.length());
                containDamResources = data.contains("/content/dam");
            } else {
                containDamResources = false;
            }
        }
    }

    private void writeMapToFileSystem(Map<String, String> htmlMap) {
        for (Map.Entry<String, String> entryHTML : htmlMap.entrySet()) {
            String pathFile = getPathToFileStore() + entryHTML.getKey();
            writeTextFile(pathFile, entryHTML.getValue());

        }

    }

    private Map<String, String> parseHTML(SlingHttpServletRequest request) throws IOException, ServletException, RepositoryException {
        Map<String, String> htmlMap = new HashMap();
        Map<String, String> queryMap = new HashMap();
        queryMap.put("type", "cq:Page");
        queryMap.put("path", "/content/portal");
        queryMap.put("p.limit", "-1");

        resolver = request.getResourceResolver();
        Session session = resolver.adaptTo(Session.class);

        Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
        SearchResult result = query.getResult();
        List<Hit> hits = result.getHits();
        String rootPortalPageHtml = processResource("/content/portal.html");
        htmlMap.put("/content/portal.html", rootPortalPageHtml);
        generateClientLibsAndImageFromHTML(rootPortalPageHtml);
        for (Hit hit : hits) {
            String path = hit.getPath() + ".html";
            String html = processResource(path);
            generateClientLibsAndImageFromHTML(html);
            htmlMap.put(path, html);
        }
        return htmlMap;
    }


    private String processResource(String path) {
        LOG.info("TRY GET RESOURCE FROM PATH : " + path);
        HttpServletRequest request = requestResponseFactory.createRequest("GET", path);
        WCMMode.DISABLED.toRequest(request);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        HttpServletResponse response = requestResponseFactory.createResponse(out);

        try {
            requestProcessor.processRequest(request, response, resolver);
        } catch (ServletException e) {

        } catch (IOException e) {
            LOG.error("FAIL TO PROCESS REQUEST WITH PATH : " + path);
            LOG.error(e.getMessage());

        }

        System.err.println("Parse " + path + " complete.");
        LOG.info(out.toString() != null ? "RESOURCE GET DONE FROM : " + path : "RESOURCE GET FAIL FROM : " + path);
        try {
            return out.toString("UTF-8");
        } catch (UnsupportedEncodingException e) {
            LOG.error(e.getMessage());

        }
        return null;
    }

    public String getPathToFileStore() {
        return PropertiesUtil.toString(componentContext.getProperties().get(PATH_TO_FILE_STORE), StringUtils.EMPTY);
    }

    private void writeTextFile(String path, String data) {
        File targetFile = new File(path);
        File parent = targetFile.getParentFile();
        if (!parent.exists() && !parent.mkdirs()) {
            LOG.error("Couldn't create dir: " + parent);
            throw new IllegalStateException("Couldn't create dir: " + parent);
        }
        LOG.info("TRY WRITE FILE : " + path);
        Writer fileWriter = null;
        try {
            fileWriter = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream(path), "UTF-8"));
            fileWriter.write(data);
            fileWriter.close();
        } catch (UnsupportedEncodingException e) {
            LOG.error("WRITE FILE FAIL : " + path);
            LOG.error(e.getMessage());
        } catch (FileNotFoundException e) {
            LOG.error("WRITE FILE FAIL : " + path);
            LOG.error(e.getMessage());
        } catch (IOException e) {
            LOG.error("WRITE FILE FAIL : " + path);
            LOG.error(e.getMessage());
        }

        LOG.info("WRITE FILE : " + path + " - COMPLETE");
    }

    private void writeBinaryFile(String path, byte[] bytes) {
        LOG.info("TRY WRITE FILE : " + path);
        File targetFile = new File(path);
        File parent = targetFile.getParentFile();
        if (!parent.exists() && !parent.mkdirs()) {
            throw new IllegalStateException("Couldn't create dir: " + parent);
        }
        Path file = Paths.get(path);
        try {
            Files.write(file, bytes);
        } catch (IOException e) {
            LOG.error("WRITE FILE FAIL : " + path);
            LOG.error(e.getMessage());
        }
    }


}
