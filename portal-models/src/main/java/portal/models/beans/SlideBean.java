package portal.models.beans;

public class SlideBean {

    public SlideBean(String pathToImage, String pathToEvent, String buttonAlign, String buttonTitle) {
        this.pathToImage = pathToImage;
        this.pathToEvent = pathToEvent;
        this.buttonAlign = buttonAlign;
        this.buttonTitle = buttonTitle;
    }

    public SlideBean() {
    }

    String pathToImage;
    String pathToEvent;
    String buttonAlign;
    String buttonTitle;

    public String getPathToImage() {
        return pathToImage;
    }

    public void setPathToImage(String pathToImage) {
        this.pathToImage = pathToImage;
    }

    public String getPathToEvent() {
        return pathToEvent;
    }

    public void setPathToEvent(String pathToEvent) {
        this.pathToEvent = pathToEvent;
    }

    public String getButtonAlign() {
        return buttonAlign;
    }

    public void setButtonAlign(String buttonAlign) {
        this.buttonAlign = buttonAlign;
    }

    public String getButtonTitle() {
        return buttonTitle;
    }

    public void setButtonTitle(String buttonTitle) {
        this.buttonTitle = buttonTitle;
    }
}
