var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.simpletext = {

        'loadDialog': function (fieldOpions) {
            return new CQ.Ext.form.TextField({
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $sortItemDiv, $spanSortAttrName, $inputsStorage, $endSelect, $spanUnits, $defaultSelectOption, $select, $inputStartParam, $inputEndParam, $inputStartParamFloat, $inputEndParamFloat, $checkbox, $inputCount) {
            var $shortList = $("<ul class='filter-list-ul'>");
            var $filterWrapper = $("<div class='filter-list-wrapper'></div>").append($shortList);
            valueArray.forEach(function (valueItem, counter) {
                if (counter < 4 ){
                    var $listItem = $("<li class='filter-list-item'><input type='checkbox'/><span class='short-list-item-title'>"+valueItem.value+"</span></li>");
                    $shortList.append($listItem);
                }
            });
            var $simpleFilter = $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($filterWrapper);
            var $fullListButton = $("<div class='full-list-container'><span class='full-list-count'>Всего "+valueArray.length+" варианта &#9654;</span></div>");
            if (valueArray.length > 4) {
                $filterWrapper.append($fullListButton);
            }
            return $simpleFilter;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);
