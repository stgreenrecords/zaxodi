var PORTAL = function (PORTAL, $) {

    PORTAL.media = (function () {

        var $stylePlaceholder = $('.media-type-placeholder');

        var modeNames = {
            MOBILE: 'mobile',
            TABLET: 'tablet',
            DESKTOP: 'desktop'
        };

        var modes = {
            mobile: new MediaMode(modeNames.MOBILE, 1),
            tablet: new MediaMode(modeNames.TABLET, 2),
            desktop: new MediaMode(modeNames.DESKTOP, 3)
        };

        function MediaMode(name, value) {
            this.name = name;
            this.value = value;
        }

        MediaMode.prototype.lessThan = function (otherMode) {
            if (otherMode && otherMode instanceof MediaMode) {
                return this.value < otherMode.value;
            } else if (otherMode && typeof otherMode === 'string') {
                var modeByName = modes[otherMode];
                if (modeByName) {
                    return this.value < modeByName.value;
                }
            }
            return false;
        };

        MediaMode.prototype.greaterThan = function (otherMode) {
            if (otherMode && otherMode instanceof MediaMode) {
                return this.value > otherMode.value;
            } else if (otherMode && typeof otherMode === 'string') {
                var modeByName = modes[otherMode];
                if (modeByName) {
                    return this.value > modeByName.value;
                }
            }
            return false;
        };

        MediaMode.prototype.is = function (otherMode) {
            if (otherMode && otherMode instanceof MediaMode) {
                return this.name === otherMode.name;
            } else if (otherMode && typeof otherMode === 'string') {
                return this.name === otherMode;
            }
            return false;
        };

        MediaMode.prototype.isNot = function (otherMode) {
            if (otherMode && otherMode instanceof MediaMode) {
                return this.name !== otherMode.name;
            } else if (otherMode && typeof otherMode === 'string') {
                return this.name !== otherMode;
            }
            return false;
        };

        function placeholder() {
            if ($stylePlaceholder.size() === 0) {
                $stylePlaceholder = $('.media-type-placeholder');
            }
            return $stylePlaceholder;
        }

        function currentMode() {
            var currentIndex = placeholder().css('z-index');

            for (var key in modes) {
                if (modes[key].value == currentIndex) {
                    return modes[key];
                }
            }
            return 'undefined';
        }

        return {
            currentMode: currentMode,
            modes: modeNames
        }
    })();

    return PORTAL;

}(PORTAL || {}, jQuery);


