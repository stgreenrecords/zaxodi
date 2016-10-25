var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.UserModel = {};

    PORTAL.modules.UserModel.selfSelector = ".user-page-block";

    PORTAL.modules.UserModel.init = function ($self) {
        console.log('Component: "UserModel"');
        $self.find("#datepicker").datepicker();

        var maleCheckbox = $self.find("input[name='sex-male']");
        maleCheckbox.change(function(){
            if ($(this).is(':checked')){
                femaleCheckbox.attr('checked',false);
            }
        });
        var femaleCheckbox = $self.find("input[name='sex-female']");
        femaleCheckbox.change(function(){
            if ($(this).is(':checked')){
                maleCheckbox.attr('checked',false);
            }
        });

        $self.find(".user-info-submit").click(function () {
            var firstName = $self.find(".first-name input").val();
            var lastName = $self.find(".last-name input").val();
            var birthday = $self.find(".user-birthday input").val();
            var phoneNumber = $self.find(".user-phone-number input").val();
            var maleSex = maleCheckbox.is(':checked');
            var femaleSex = femaleCheckbox.is(':checked');

            if (firstName || lastName || birthday || phoneNumber || maleSex || femaleSex){

            }


        });
    }

    return PORTAL;

})(PORTAL || {}, jQuery);