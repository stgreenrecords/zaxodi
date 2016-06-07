var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.ColumnControl = {};

    PORTAL.modules.ColumnControl.init = function () {
        console.log('Component: "ColumnControl"');
        var device = PORTAL.media.currentMode();
        if (device.name == PORTAL.media.modes.MOBILE){
            var $columnsItem = $(".column_control_block .item_column");
            var windowWidth = $(window).width();
            $columnsItem.each(function( index ) {
                $( this ).width(windowWidth);
            });
        }
    }

    return PORTAL;

})(PORTAL || {}, jQuery);