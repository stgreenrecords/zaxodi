window.$ = window.jQuery;

var PORTAL = (function (PORTAL, $) {

    // Augmenting shared objects and arrays
    PORTAL.modules = PORTAL.modules || {};

    PORTAL.initMods = function () {
        for (var mod in PORTAL.modules) {
            try {
                var $self = $(PORTAL.modules[mod].selfSelector);
                // Run required modules with default selector
                if (typeof PORTAL.modules === 'undefined') {
                    console.log("No PORTAL modules found for page.");
                    return;
                }
                if ($self.length) {
                    PORTAL.modules[mod].init($self);
                }
            } catch (e) {
                if (PORTAL.utils.isAuthMode()) {
                    console.log(e);
                }
            }
        }
    };

    return PORTAL;

})(PORTAL || {}, jQuery);


jQuery(function () {
    PORTAL.initMods();
});
