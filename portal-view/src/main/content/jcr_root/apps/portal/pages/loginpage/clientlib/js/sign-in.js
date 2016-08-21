var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.Login = {};

    PORTAL.modules.Login.selfSelector = ".registration-ui";

    PORTAL.modules.Login.init = function ($self) {
        console.log('Component: "Login"');

        var $messageBlock = $self.find(".messageBlock");

        var statusMap = {
            "failCaptcha": "К сажалению вы не прошли проверку на робота и мы будем вынуждены отрезать вам левое яичко",
            "exist": "Вы бухали когда регистрировались в первый раз и уже не помните? К сажалению пользователь с таким именем уже сущувствует.",
            "registrationLetterFailSend": "К сожалению отправка письма на ваш почтовый ящик закончилась неудачей. Повторите попытку регистрации позже либо заведите нормальную почту",
            "successMessage": "Поздравляем! Вы зарегистрировались. На вашу почту отправлено письмо с потверждением регистрации. Аккаунт будет активирован сразу после потверждения. и мы будем вынуждены отрезать вам правое яичко",
            "success": function (email) {
                $.ajax({
                    url: "/services/notifications.registration",
                    type: "POST",
                    data: {
                        email: email || emailLogin,
                        newsletter: "/content/campaigns/portal/notifications/userValidation/jcr:content"
                    },
                    success: function (data) {
                        if (data == 'registrationLetterFailSend') {
                            $messageBlock.text('');
                            $messageBlock.text(statusMap[data]);
                        } else {
                            if (data == "registrationLetterSuccessSend") {
                                $messageBlock.text('');
                                $messageBlock.text(statusMap.successMessage);
                            }
                        }

                    }
                });
            },
            "fail": "Юзера с такимы почтовыя ящиком или паролем не сущевствует.",
            "loginSuccess": function (email) {
                var currentTime = new Date().getTime();
                var expTime = 172800000 + currentTime;
                PORTAL.utils.set_cookie("portalAuthorization", email, new Date(expTime));
                var referrerLink = $self.find("#registrationReferrer").data("referer") || "/content/portal.html";
                location.href = referrerLink;
            }
        };
        var $loginButton = $self.find("#submitRegistrationInput,#submitLoginInput").click(function () {
            var typeAction = $(this).data("type");
            var validationStatus = true;
            var email = $self.find("#emailRegistrationInput").val();
            var emailLogin = $self.find("#emailLoginInput").val();
            var pass = $self.find("#passRegistrationInput").val();
            var passLogin = $self.find("#passLoginInput").val();
            var passAgain = $self.find("#passRegistrationAgainInput").val();
            if (typeAction == 'registration') {
                if (email) {
                    if (email.lastIndexOf("@") < 0) {
                        validationStatus = false;
                        $messageBlock.text('');
                        $messageBlock.text("Введите Email в формате example@host.com");
                    }
                } else {
                    validationStatus = false;
                    $messageBlock.text('');
                    $messageBlock.text("Email обязателен!");
                }

                if (pass && passAgain) {
                    if (pass != passAgain) {
                        validationStatus = false;
                        $messageBlock.text('');
                        $messageBlock.text("Пароли не совпадают!");
                    }
                } else {
                    validationStatus = false;
                    $messageBlock.text('');
                    $messageBlock.text("Пароль обязателен!");
                }
            }
            if (typeAction == 'login') {
                if (emailLogin) {
                    if (emailLogin.lastIndexOf("@") < 0) {
                        validationStatus = false;
                        $messageBlock.text('');
                        $messageBlock.text("Введите Email в формате example@host.com");
                    }
                } else {
                    validationStatus = false;
                    $messageBlock.text('');
                    $messageBlock.text("Email обязателен!");
                }
                if (!passLogin) {
                    validationStatus = false;
                    $messageBlock.text('');
                    $messageBlock.text("Пароль обязателен!");
                }
            }

            if (validationStatus) {
                $.ajax({
                    url: "/services/signin." + typeAction,
                    type: "POST",
                    data: {
                        response: grecaptcha.getResponse(),
                        email: email || emailLogin,
                        pass: pass || passLogin
                    },
                    success: function (data) {
                        if (data) {
                            if (data == 'loginSuccess') {
                                statusMap[data](emailLogin);
                            } else {
                                if (data == 'success') {
                                    statusMap[data](email);
                                } else {
                                    $messageBlock.text('');
                                    $messageBlock.text(statusMap[data]);
                                }
                            }
                        }
                    }
                });
            }
            if (validationStatus) {
            }
        });

    }

    return PORTAL;

})(PORTAL || {}, jQuery);