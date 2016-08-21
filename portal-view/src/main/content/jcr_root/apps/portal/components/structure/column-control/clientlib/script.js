var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.ColumnControl = {};

    PORTAL.modules.ColumnControl.selfSelector = ".column_control_block";

    PORTAL.modules.ColumnControl.init = function ($self) {
        console.log('Component: "ColumnControl"');
        var device = PORTAL.media.currentMode();
        if (device.name == PORTAL.media.modes.MOBILE){
            var $columnsItem = $self.find(".item_column");
            var windowWidth = $(window).width();
            $columnsItem.each(function( index ) {
                $( this ).width(windowWidth);
            });
        }
    }

    return PORTAL;

})(PORTAL || {}, jQuery);