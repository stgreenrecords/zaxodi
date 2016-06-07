window.$ = window.jQuery;

var PORTAL = (function (PORTAL, $) {

    // Augmenting shared objects and arrays
    PORTAL.modules = PORTAL.modules || {};

    PORTAL.initMods = function() {
        // Run required modules with default selector
        if (typeof PORTAL.modules === 'undefined') {
            console.log("No PORTAL modules found for page.");
            return;
        }
        for (var mod in PORTAL.modules) {
            try {
                PORTAL.modules[mod].init();
            } catch(e) {
                console.log("Can't init mod: "+PORTAL.modules[mod].name);
            }
        }
    };

    return PORTAL;

})(PORTAL || {}, jQuery);


jQuery(function() {
    PORTAL.initMods();
});
