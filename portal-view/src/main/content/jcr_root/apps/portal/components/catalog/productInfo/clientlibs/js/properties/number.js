var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.number = {

        'loadDialog' : function(fieldOpions) {
            return new CQ.Ext.form.NumberField({
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $sortItemDiv, $spanSortAttrName, $inputsStorage, $endSelect, $spanUnits, $defaultSelectOption, $select, $inputStartParam, $inputEndParam, $inputStartParamFloat, $inputEndParamFloat, $checkbox, $inputCount) {
            return $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($inputsStorage.append($inputStartParam).append($inputEndParam));
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);

