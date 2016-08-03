package portal.models.beans;


public class SimplePageBean {

    private String path;
    private String title;


    public SimplePageBean(String path, String title) {
        this.path = path;
        this.title = title;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
