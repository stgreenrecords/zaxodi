package portal.cms.pipeline;

import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.servlet.ServletException;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/helper")
})
public class HelperServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(HelperServlet.class);

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException {
        try {
            NodeIterator catalogNode = request.getResourceResolver().getResource("/content/portal/catalog").adaptTo(Node.class).getNodes();

            while (catalogNode.hasNext()){
                Node superCategoryNode = catalogNode.nextNode();
                if (!superCategoryNode.getName().equals("jcr:content")){
                    NodeIterator subCategoryIterator = superCategoryNode.getNodes();
                    while (subCategoryIterator.hasNext()){
                        Node subCategoryNode = subCategoryIterator.nextNode();
                        if (!subCategoryNode.getName().equals("jcr:content")){
                            subCategoryNode.setProperty("cq:template","/apps/portal/templates/catalogcategorytemplate");
                            subCategoryNode.setProperty("sling:resourceType","portal/pages/catalogcategorypage");
                        }
                    }
                }
            }
            request.getResourceResolver().commit();
        }
        catch (RepositoryException e) {
            e.printStackTrace();
        } catch (PersistenceException e) {
            e.printStackTrace();
        }
    }

}
