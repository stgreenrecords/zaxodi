var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.TopNavigation = {};

    PORTAL.modules.TopNavigation.selfSelector = ".main_top_nav";

    PORTAL.modules.TopNavigation.init = function ($self) {
        console.log('Component: "TopNavigation"');

        var sessionCookie = PORTAL.utils.get_cookie("portal-session-id");
        var email = PORTAL.utils.get_cookie("portal-user");

        var isSessionIdValid = function(sessionCookie, email){
            $.ajax({
                url: "/services/verifying",
                type: "POST",
                data: {
                    'portal-session-id': sessionCookie,
                    'portal-user': email
                },
                success: function (data) {
                    if (data) {
                        return data;
                    }
                }
            });
        }

        if (sessionCookie && email && isSessionIdValid(sessionCookie, email)){
            $self.find(".user_item").css("display","block");
        } else {
            $self.find(".login_home").css("display","block");
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);
