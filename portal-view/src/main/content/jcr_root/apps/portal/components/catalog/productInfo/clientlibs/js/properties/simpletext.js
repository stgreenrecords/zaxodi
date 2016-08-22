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
            var $simpleFilter = $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($select.append($defaultSelectOption));
            valueArray.forEach(function (valueItem) {
                var $enumOption = $("<option>").text(valueItem.value);
                $($select).append($enumOption);
            });
            return $simpleFilter;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);
