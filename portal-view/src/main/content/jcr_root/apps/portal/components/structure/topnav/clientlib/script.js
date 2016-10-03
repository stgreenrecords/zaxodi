var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.TopNavigation = {};

    PORTAL.modules.TopNavigation.selfSelector = ".main_top_nav";

    PORTAL.modules.TopNavigation.init = function ($self) {
        console.log('Component: "TopNavigation"');

    }

    return PORTAL;

})(PORTAL || {}, jQuery);



/*
var authCookie = PORTAL.utils.get_cookie("portalAuthorization");

if (authCookie) {
    $loginButton.text(authCookie);
    var $exit = $("<a href='/content/portal.html' class='login-exit'>Выйти</a>").click(function () {
        PORTAL.utils.set_cookie("portalAuthorization", '', new Date(1));
    });
    var $btnSign = $self.find(".btn-sign").append($exit);
    console.log($btnSign);
} else {
    $loginButton.text("Войти").attr("href", "/content/portal/registration.html");
}*/
