var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.VideoPlayer = {};

    PORTAL.modules.VideoPlayer.init = function () {
        console.log('Component: "VideoPlayer"');

        var url = $(".video-player").data("url");
        var videoID = PORTAL.utils.getQueryParameterFromUrl(url,"v");
		$(".video-player iframe").attr("src","https://www.youtube.com/embed/"+videoID)

    }

    return PORTAL;

})(PORTAL || {}, jQuery);
