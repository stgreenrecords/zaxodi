var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.VideoPlayer = {};

    PORTAL.modules.VideoPlayer.selfSelector = ".video-player";

    PORTAL.modules.VideoPlayer.init = function ($self) {
        console.log('Component: "VideoPlayer"');

        var url = $self.data("url");
        var videoID = PORTAL.utils.getQueryParameterFromUrl(url,"v");
		$(".video-player iframe").attr("src","https://www.youtube.com/embed/"+videoID)

    }

    return PORTAL;

})(PORTAL || {}, jQuery);
