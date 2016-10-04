package portal.core.services.users.impl;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.JsonObject;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.principal.PrincipalManager;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.value.ValueFactoryImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.services.product.PortalProduct;
import portal.core.services.users.PortalUserManager;
import portal.core.services.users.beans.PortalUser;
import portal.core.services.users.beans.Seller;
import portal.core.utils.PortalUtils;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import java.security.Principal;
import java.util.*;

@Component
@Service(PortalUserManager.class)
public class PortalUserManagerImpl implements PortalUserManager {

    private static final Logger LOG = LoggerFactory.getLogger(PortalUserManagerImpl.class);

    @Reference
    private PortalUtils portalUtils;

    @Reference
    private QueryBuilder queryBuilder;

    public boolean addPortalUser(final String email, String pass) {
        LOG.info("TRY ADD NEW USER WITH NAME : " + email);
        User user = null;
        try {
            String pathToNewUserFolder = "/home/users/portal/users" + "/" + email.substring(0, 1);
            PrincipalManager principalManager = getJackrabbitSession().getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            if (principal == null) {
                user = getJackrabbitSession().getUserManager().createUser(email, pass, new Principal() {
                    public String getName() {
                        return email;
                    }
                }, pathToNewUserFolder);
                user.setProperty("./profile/email", ValueFactoryImpl.getInstance().createValue(email));
                user.setProperty("verifiedStatus", ValueFactoryImpl.getInstance().createValue(false));
                Group portalUsers = (Group) getJackrabbitSession().getUserManager().getAuthorizable("portal-users");
                Authorizable authorizable = getJackrabbitSession().getUserManager().getAuthorizable(user.getPrincipal());
                portalUsers.addMember(authorizable);
                getJackrabbitSession().move(user.getPath(), pathToNewUserFolder + "/" + email);
                getJackrabbitSession().save();
                LOG.info("USER SUCCESS CREATE");
                return true;
            } else {
                LOG.info("USER WITH THAT NAME ALREADY EXIST : " + email);
                return false;
            }
        } catch (RepositoryException e) {
            LOG.error(e.getMessage());
        }
        LOG.info("FAILED ADD NEW USER");
        return false;
    }

    public boolean updateSeller(String email, Date birthday, int age, String firstName, String lastName, String phoneNumber, String sex) {
        return false;
    }

    public boolean updateUser(String email, Date birthday, int age, String firstName, String lastName, String phoneNumber) {
        return false;
    }

    public boolean deleteUser(String email) {
        return false;
    }

    public boolean addNewSeller(String email, String pass) {
        return false;
    }

    public void addVerifyStatus(String email) {
        try {
            PrincipalManager principalManager = getJackrabbitSession().getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            if (principal != null) {
                Authorizable authorizable = (User) getJackrabbitSession().getUserManager().getAuthorizable(principal);
                authorizable.setProperty("verifiedStatus", ValueFactoryImpl.getInstance().createValue(true));
                getJackrabbitSession().save();
                LOG.info("USER SUCCESS VERIFY ON JCR LAYER");
            } else {
                LOG.info("FAIL VERIFY USER. THAT NAME DOESN'T EXIST : " + email);
            }
        } catch (RepositoryException e) {
            LOG.error(e.getMessage());
        }
    }

    public boolean isVerify(String email) {
        try {
            PrincipalManager principalManager = getJackrabbitSession().getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            if (principal != null) {
                Authorizable authorizable = (User) getJackrabbitSession().getUserManager().getAuthorizable(principal);
                Value[] verifiedStatus = authorizable.getProperty("verifiedStatus");
                if (verifiedStatus.length > 0 && verifiedStatus[0].getBoolean()) {
                    return true;
                }
            } else {
                LOG.info("USER DOESN'T EXIST");
            }
        } catch (RepositoryException e) {
            LOG.error(e.getMessage());
        }
        return false;
    }

    public Seller getSeller(String email) {
        return null;
    }

    public PortalUser getPortalUser(String email) {
        PortalUser portalUser = new PortalUser();
        portalUser.setEmail(email);
        try {
            Authorizable authorizable = portalUtils.getAdminSession().getUserManager().getAuthorizable(email);
            Node userNode = portalUtils.getAdminSession().getNode(authorizable.getPath());
            List<PortalProduct> productList = new ArrayList();
            Map<String, String> map = new HashMap<String, String>();
            map.put("path", authorizable.getPath()+"/catalog");
            map.put("property", "isActive");
            map.put("property.value", "true");
            map.put("p.limit", "-1");

            Query query = queryBuilder.createQuery(PredicateGroup.create(map), portalUtils.getAdminSession());
            SearchResult result = query.getResult();

            for (Hit hit : result.getHits()) {
                Node searchNode = null;
                try {
                    searchNode = hit.getNode();
                    PortalProduct portalProduct = new PortalProduct();
                    productList.add(portalProduct);
                } catch (RepositoryException e) {
                    LOG.error(e.getMessage());
                }
            }
          portalUser.setProductList(productList);
        } catch (RepositoryException e) {
            LOG.error("FAILT TO BUILD USER. Details:" + e.getMessage());
        }
        return portalUser;
    }

    public JsonObject getPortalUserInfoAsJson(String email){
       PortalUser portalUser = getPortalUser(email);
        JsonObject jsonUser = new JsonObject();
        jsonUser.addProperty("name", portalUser.getEmail());
        jsonUser.addProperty("basketCount",portalUser.getProductList().size());
        return jsonUser;
    }

    public JackrabbitSession getJackrabbitSession() {
        return portalUtils.getAdminSession();
    }
}
