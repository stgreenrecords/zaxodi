var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.interval = {

        'loadDialog' : function(fieldOpions) {
            return new CQ.form.CatalogSizeField({
                widthParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                heightParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                heightSuffix: fieldOpions.units || '',
                widthSuffix: fieldOpions.units || '',
                heightPrefix: 'До',
                widthPrefix: 'От',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $sortItemDiv, $spanSortAttrName, $inputsStorage, $endSelect, $spanUnits, $defaultSelectOption, $select, $inputStartParam, $inputEndParam, $inputStartParamFloat, $inputEndParamFloat, $checkbox, $inputCount) {
            filterItem.startParamArray = sortArrays.startParamArray;
            filterItem.endParamArray = sortArrays.endParamArray;
            var $startSelect = $("<select>").addClass("startSelectFilter").append("<option>Выбрать</option>");
            var $endSelect = $("<select>").addClass("endSelectFilter").append("<option>Выбрать</option>");
            var $interval = $sortItemDiv.append($spanSortAttrName).append($spanUnits).append($inputsStorage.append($startSelect).append(" - ").append($endSelect));
            sortArrays.startParamArray.forEach(function (startItem) {
                $startSelect.append($("<option>" + startItem + "</option>"));
            });
            sortArrays.endParamArray.forEach(function (endItem) {
                $endSelect.append($("<option>" + endItem + "</option>"));
            });

            return $interval;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);

