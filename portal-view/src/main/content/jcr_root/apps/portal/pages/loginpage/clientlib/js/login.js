var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.BaseComponent = {};

    PORTAL.modules.BaseComponent.selfSelector = ".registration-ui";

    PORTAL.modules.BaseComponent.init = function ($self) {
        console.log('Component: "BaseComponent"');

        var $messageBlock = $self.find(".messageBlock");
        var typeAction;
        var validationStatus = true;

        if (location.href.indexOf("?verifyStatus=true") != -1){
            $messageBlock.text("Validation succeed. Try to login.");
        }

        $self.find("#submitRegistrationInput, #submitLoginInput").click(function () {
            var email = $self.find("#emailRegistrationInput").val();
            var emailLogin = $self.find("#emailLoginInput").val();
            var pass = $self.find("#passRegistrationInput").val();
            var passLogin = $self.find("#passLoginInput").val();
            var passAgain = $self.find("#passRegistrationAgainInput").val();
            typeAction = $(this).data("type");
            if (isFormValid(email, pass, passAgain, emailLogin, passLogin)) {
                if (typeAction == 'registration') {
                    sendRequestToRegistration(email, pass);
                } else {
                    sendRequestToLogin(emailLogin, passLogin);
                }

            }
        });

        var sendRequestToRegistration = function (email, pass) {
            $.ajax({
                url: "/services/registration",
                type: "POST",
                data: {
                    'responseFromCaptcha': grecaptcha.getResponse(),
                    'email': email,
                    'pass': pass
                },
                success: function (data) {
                    if (data) {
                        $messageBlock.text(data);
                    }
                }
            });
        }

        var sendRequestToLogin = function (email, pass) {
            $.ajax({
                url: "/services/login",
                type: "POST",
                data: {
                    'email': email,
                    'pass': pass
                },
                success: function (data) {
                    if (data == "successLogin") {
                        location.href = "/content/portal.html"
                    } else {
                        $messageBlock.text(data);
                    }
                }
            });
        }

        var isFormValid = function (email, pass, passAgain, emailLogin, passLogin) {
            if (typeAction == 'registration') {
                if (!email || !pass || !passAgain) {
                    $messageBlock.text("Пожалуйста заполните все поля");
                    return false;
                }
                if (pass != passAgain) {
                    $messageBlock.text("Пароль не совпадают");
                    return false;
                }
                if (!email.match("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$")) {
                    $messageBlock.text("Не правильный формат для почтового адресса");
                    return false;
                }
            }
            return true;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);