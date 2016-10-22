package portal.cms.pipeline;


import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.wcm.api.Page;
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
import java.util.Iterator;
import java.util.List;


@SlingServlet(paths = {"/services/helper"})
public class HelperServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(HelperServlet.class);

    List<String> stringArrayList = new ArrayList<String>();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException {
        try {

            Page catalogPage = request.getResourceResolver().getResource("/content/portal/catalog").adaptTo(Page.class);
            Iterator<Page> pageIterator = catalogPage.listChildren();
            while (pageIterator.hasNext()){
               Page superCategoryPage = pageIterator.next();
                Iterator<Page> categoryIterator = superCategoryPage.listChildren();
                while (categoryIterator.hasNext()){
                    Page categoryPage = categoryIterator.next();
                    String categoryName = categoryPage.getName();
                    Node categoryNode = categoryPage.adaptTo(Node.class).getNode("jcr:content");
                    String repairedName = categoryName.contains("-") ? categoryName.replaceAll("-"," ") : categoryName;
                    String firstSymbol = repairedName.substring(0,1);
                    String finalString = repairedName.replaceFirst(firstSymbol,firstSymbol.toUpperCase());
                    categoryNode.setProperty("jcr:title", finalString);

                }

            }


           /* Node topNavNode = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/topnav").adaptTo(Node.class);
            Node catalogNavigation = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/catalognavigation").adaptTo(Node.class);
            Node columns = request.getResourceResolver().getResource("/apps/portal/templates/catalogproducttemplate/jcr:content/columns").adaptTo(Node.class);
            Node video = request.getResourceResolver().getResource("/apps/portal/templates/catalogproducttemplate/jcr:content/video").adaptTo(Node.class);
            Node parsys = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/parsys").adaptTo(Node.class);
            Node footer = request.getResourceResolver().getResource("/apps/portal/templates/catalogcategorytemplate/jcr:content/footer").adaptTo(Node.class);

            while (catalogNode.hasNext()) {
                Node superCategoryNode = catalogNode.nextNode();
                if (!superCategoryNode.getName().equals("jcr:content")) {
                    NodeIterator subCategoryIterator = superCategoryNode.getNodes();
                    while (subCategoryIterator.hasNext()) {
                        Node subCategoryNode = subCategoryIterator.nextNode();
                        if (!subCategoryNode.getName().equals("jcr:content")){
                            NodeIterator subCategoryNodeIterator = subCategoryNode.getNodes();
                            while (subCategoryNodeIterator.hasNext()) {
                                Node productNode = subCategoryNodeIterator.nextNode();
                                if (!productNode.getName().equals("jcr:content")) {
                                    Node jcrContent = productNode.getNode("jcr:content");
                                    jcrContent.setProperty("cq:template","/apps/portal/templates/catalogproducttemplate");
                                    jcrContent.setProperty("sling:resourceType","portal/pages/catalogproductpage");
                                    JcrUtil.copy(topNavNode, jcrContent, topNavNode.getName());
                                    JcrUtil.copy(catalogNavigation, jcrContent, catalogNavigation.getName());
                                    Node column = JcrUtil.copy(columns, jcrContent, columns.getName());
                                    Node videoNodeNew = JcrUtil.copy(video, jcrContent, video.getName());
                                    JcrUtil.copy(parsys, jcrContent, parsys.getName());
                                    JcrUtil.copy(footer, jcrContent, footer.getName());
                                    Node itemInfo = null;
                                    if (jcrContent.hasNode("content_container/section/section-par/catalogItemInfo")) {
                                        itemInfo = jcrContent.getNode("content_container/section/section-par/catalogItemInfo");
                                    }
                                    Node videoNode = null;
                                    if (jcrContent.hasNode("content_container/section/section-par/video")){
                                        videoNode = jcrContent.getNode("content_container/section/section-par/video");
                                    }
                                    if (itemInfo != null){
                                        Node newProductInfo = JcrUtil.copy(itemInfo, column.getNode("parsys0"), "productinfo");
                                        newProductInfo.setProperty("sling:resourceType","portal/components/catalog/productInfo");
                                        if (newProductInfo.hasNode("gallery")){
                                            Node galleryNode = newProductInfo.getNode("gallery");
                                            galleryNode.setProperty("sling:resourceType","portal/components/content/video");
                                        }
                                    }
                                    if (videoNode != null){
                                        if (videoNode.hasProperty("link")){
                                            videoNodeNew.setProperty("link",videoNode.getProperty("link").getString());
                                        }
                                    }
                                    if (jcrContent.hasNode("content_container")){
                                        jcrContent.getNode("content_container").remove();
                                    }
                                }
                            }
                        }*/

 /*                       if (!subCategoryNode.getName().equals("jcr:content")){
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

                        }*/
/*                    }
                }*/
  //          }
            request.getResourceResolver().commit();
            PrintWriter printWriter = response.getWriter();
            for (String path : stringArrayList) {
                printWriter.println(path);
            }
        } catch (RepositoryException e) {
            e.printStackTrace();
        } catch (PersistenceException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
