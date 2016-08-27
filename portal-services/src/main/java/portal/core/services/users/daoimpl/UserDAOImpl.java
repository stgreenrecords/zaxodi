package portal.core.services.users.daoimpl;

import org.apache.felix.scr.annotations.Reference;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.principal.PrincipalManager;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.value.ValueFactoryImpl;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import portal.core.services.users.UserDAO;
import portal.core.services.users.beans.Comment;
import portal.core.services.users.beans.Seller;
import portal.core.utils.ServiceUtils;

import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.security.Principal;
import java.util.Date;
import java.util.List;

public class UserDAOImpl implements UserDAO {

    private static final Logger LOG = LoggerFactory.getLogger(UserDAOImpl.class);

    private JackrabbitSession jackrabbitSession;

    @Reference
    private Repository repository;
    private ResourceResolver resourceResolver;

    public UserDAOImpl(ResourceResolver resourceResolver) {
        this.resourceResolver = resourceResolver;
        jackrabbitSession = ServiceUtils.getAdminSession(resourceResolver);
    }

    public boolean addNewUser(final String email, String pass) {
        LOG.info("TRY ADD NEW USER WITH NAME : " + email);
        User user = null;
        try {
            String pathToNewUserFolder = "/home/users/portal/users" + "/" + email.substring(0, 1);
            PrincipalManager principalManager = jackrabbitSession.getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            if (principal == null) {
                user = jackrabbitSession.getUserManager().createUser(email, pass, new Principal() {
                    public String getName() {
                        return email;
                    }
                }, pathToNewUserFolder);
                user.setProperty("./profile/email", ValueFactoryImpl.getInstance().createValue(email));
                user.setProperty("verifiedStatus", ValueFactoryImpl.getInstance().createValue(false));
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
            PrincipalManager principalManager = jackrabbitSession.getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            if (principal != null) {
                Authorizable authorizable = (User) jackrabbitSession.getUserManager().getAuthorizable(principal);
                authorizable.setProperty("verifiedStatus", ValueFactoryImpl.getInstance().createValue(true));
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
            PrincipalManager principalManager = jackrabbitSession.getPrincipalManager();
            Principal principal = principalManager.getPrincipal(email);
            if (principal != null) {
                Authorizable authorizable = (User) jackrabbitSession.getUserManager().getAuthorizable(principal);
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

    public portal.core.services.users.beans.User getUser(String email) {
        return null;
    }


}