package portal.cms.pipeline;

import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/test")
})
public class TestServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(TestServlet.class);

    @Reference
    org.apache.sling.settings.SlingSettingsService slingSettingsService;


    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException {
        LOG.error("HE! IT'S TEST SERVLET. AND THIS ERROR TEST LOG");
        LOG.info("HE! IT'S TEST SERVLET. AND THIS INFO TEST LOG");
        for (String runMode : slingSettingsService.getRunModes()){
            LOG.info("CURRENT RUN_MODE : " + runMode);
        }


    }

}
