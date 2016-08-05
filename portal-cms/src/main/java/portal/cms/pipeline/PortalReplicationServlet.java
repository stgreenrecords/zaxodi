package portal.cms.pipeline;

import com.day.cq.commons.jcr.JcrUtil;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.commons.JcrUtils;
import org.apache.jackrabbit.commons.cnd.CndImporter;
import org.apache.jackrabbit.commons.cnd.ParseException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.jcr.*;
import javax.jcr.nodetype.InvalidNodeTypeDefinitionException;
import javax.jcr.nodetype.NodeTypeExistsException;
import javax.servlet.ServletException;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

@Component(metatype = true, immediate = true)
@Service
@Properties({
        @Property(name = "sling.servlet.paths", value = "/services/replication")
})
public class PortalReplicationServlet extends SlingAllMethodsServlet {

    static Repository customRepository;
    static Session customSession;
    static Repository cqRepository;
    static Session cqSession;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException, ServletException {
        cqSession = request.getResourceResolver().adaptTo(Session.class);
        try {
            loginInCustomRepository();
            applyRecursiveReplication("/content/portal/catalog");
        } catch (RepositoryException e) {
        } catch (NotBoundException e) {
            e.printStackTrace();
        }
    }

    private static void logins() throws RepositoryException {
        customRepository = JcrUtils.getRepository("http://localhost:8080/server");
        customSession = customRepository.login(new SimpleCredentials("admin", "admin".toCharArray()));

        cqRepository = JcrUtils.getRepository("http://localhost:4502/crx/server");
        cqSession = cqRepository.login(new SimpleCredentials("admin", "admin".toCharArray()));
    }

    private static void loginInCustomRepository() throws RepositoryException {
        customRepository = JcrUtils.getRepository("http://localhost:8080/server");
        customSession = customRepository.login(new SimpleCredentials("admin", "admin".toCharArray()));
    }

    private static void applyRecursiveReplication(String path) throws RepositoryException, RemoteException, NotBoundException, MalformedURLException {
        Node rootPortalNode = customSession.getNode(path);
        replicateRecursiveNode(rootPortalNode, cqSession.getNode(path.substring(0, path.lastIndexOf("/"))));
    }

    private static void replicateRecursiveNode(Node nodeForReplication, Node parentNode) throws RepositoryException {
        System.out.println("START REPLICATION : "+ nodeForReplication.getPath());
        Node replicatedNode = JcrUtil.copy(nodeForReplication, parentNode, nodeForReplication.getName());
        customSession.save();
        System.out.println("END REPLICATION : "+ replicatedNode.getPath());
        NodeIterator childNodesForReplication = nodeForReplication.getNodes();
        while (childNodesForReplication.hasNext()) {
            Node childNodeForReplication = childNodesForReplication.nextNode();
            replicateRecursiveNode(childNodeForReplication, replicatedNode);
        }
    }

    private static void importNodeTypes() {
        try {
            System.out.println("Всего типов в CQ : " + cqSession.getWorkspace().getNodeTypeManager().getAllNodeTypes().getSize());
            System.out.println("Всего типов в CUSTOM : " + customSession.getWorkspace().getNodeTypeManager().getAllNodeTypes().getSize());
            FileReader fileReader = new FileReader("d:/list.jsp.txt");
            CndImporter.registerNodeTypes(fileReader, customSession);
            System.out.println("Всего типов в CUSTOM после добавления : " + customSession.getWorkspace().getNodeTypeManager().getAllNodeTypes().getSize());

        } catch (NodeTypeExistsException e) {
            e.printStackTrace();
        } catch (InvalidNodeTypeDefinitionException e) {
            e.printStackTrace();
        } catch (UnsupportedRepositoryOperationException e) {
            e.printStackTrace();
        } catch (RepositoryException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }



}
