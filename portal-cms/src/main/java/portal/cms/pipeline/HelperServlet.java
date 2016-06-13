package portal.cms.pipeline;


import com.day.cq.commons.jcr.JcrUtil;
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
import javax.jcr.Value;
import javax.servlet.ServletException;
import org.apache.felix.scr.annotations.sling.SlingServlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;


@SlingServlet(paths = {"/services/helper"})
public class HelperServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(HelperServlet.class);

    List<String> stringArrayList = new ArrayList<String>();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException {
        try {

            NodeIterator catalogNode = request.getResourceResolver().getResource("/content/portal/catalog").adaptTo(Node.class).getNodes();
            Node topNavNode = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/topnav").adaptTo(Node.class);
            Node catalogNavigation = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/catalognavigation").adaptTo(Node.class);
            Node columns = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/columns").adaptTo(Node.class);
            Node parsys = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/parsys").adaptTo(Node.class);
            Node footer = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/footer").adaptTo(Node.class);

            while (catalogNode.hasNext()){
                Node superCategoryNode = catalogNode.nextNode();
                if (!superCategoryNode.getName().equals("jcr:content")){
                    NodeIterator subCategoryIterator = superCategoryNode.getNodes();
                    while (subCategoryIterator.hasNext()){
                        Node subCategoryNode = subCategoryIterator.nextNode();
                        if (!subCategoryNode.getName().equals("jcr:content")){
                            Node jcrContent = subCategoryNode.getNode("jcr:content");
                            stringArrayList.add(subCategoryNode.getPath());
                            jcrContent.setProperty("cq:template","/apps/portal/templates/catalogcategorytemplate");
                            jcrContent.setProperty("sling:resourceType","portal/pages/catalogcategorypage");
                            JcrUtil.copy(topNavNode, jcrContent, topNavNode.getName());
                            JcrUtil.copy(catalogNavigation, jcrContent, catalogNavigation.getName());
                            Node column = JcrUtil.copy(columns, jcrContent, columns.getName());
                            JcrUtil.copy(parsys, jcrContent, parsys.getName());
                            JcrUtil.copy(footer, jcrContent, footer.getName());
                            if (jcrContent.hasNode("content_container")){
                                Node old = jcrContent.getNode("content_container");
                                Node oldTemp = old.getNode("section/section-par/catalogitemslist");
                                String subcategory = oldTemp.hasProperty("subCategory") ? oldTemp.getProperty("subCategory").getString() : "";
                                Value[] properties = oldTemp.hasProperty("properties") ? oldTemp.getProperty("properties").getValues() : null;
                                Node productList = column.getNode("parsys0/productlist");
                                if (properties != null){
                                    productList.setProperty("properties",properties);
                                }
                                productList.setProperty("subCategory",subcategory);
                                old.remove();
                            }

                        }
                    }
                }
            }
            request.getResourceResolver().commit();
            PrintWriter printWriter = response.getWriter();
            for (String path : stringArrayList){
                printWriter.println(path);
            }
        }
        catch (RepositoryException e) {
            e.printStackTrace();
        } catch (PersistenceException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
