var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.enum = {

        'loadDialog': function (fieldOpions) {
            return new CQ.form.MultiField({
                fieldConfig: {"xtype": "textfield"},
                fieldLabel: fieldOpions.valueSelection,
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                itemID: 'property',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $sortItemDiv, $spanSortAttrName, $inputsStorage, $endSelect, $spanUnits, $defaultSelectOption, $select, $inputStartParam, $inputEndParam, $inputStartParamFloat, $inputEndParamFloat, $checkbox, $inputCount) {
            var $enumFilter = $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($select.append($defaultSelectOption));
            valueArray.forEach(function (valueItem) {
                var $enumOption = $("<option>").text(valueItem.value);
                $($select).append($enumOption);
            });

            return $enumFilter;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);