package portal.models.beans;

public class PromoBean {


    private String path;
    private String titleTop;
    private String titleBottom;

    public PromoBean(String path, String titleTop, String titleBottom) {
        this.path = path;
        this.titleTop = titleTop;
        this.titleBottom = titleBottom;
    }

    public PromoBean() {
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTitleTop() {
        return titleTop;
    }

    public void setTitleTop(String titleTop) {
        this.titleTop = titleTop;
    }

    public String getTitleBottom() {
        return titleBottom;
    }

    public void setTitleBottom(String titleBottom) {
        this.titleBottom = titleBottom;
    }
}
