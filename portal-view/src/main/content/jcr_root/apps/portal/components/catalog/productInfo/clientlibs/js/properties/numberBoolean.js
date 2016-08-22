var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.numberBoolean = {

        'loadDialog' : function(fieldOpions) {
            return new CQ.form.CatalogBooleanNumberField({
                fieldLabel: fieldOpions.valueSelection,
                booleanParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                countParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                itemID: 'property',
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                countPrefix: 'Количество:',
                booleanPrefix: 'Присутствует:',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units,
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $sortItemDiv, $spanSortAttrName, $inputsStorage, $endSelect, $spanUnits, $defaultSelectOption, $select, $inputStartParam, $inputEndParam, $inputStartParamFloat, $inputEndParamFloat, $checkbox, $inputCount) {
            if (filterItem.count && filterItem.count == 1) {
                return $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($checkbox);
            }
            if (filterItem.count && filterItem.count > 1) {
                return $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($checkbox).append($inputCount);
            }
        }


    }

    return PORTAL;

})(PORTAL || {}, jQuery);

