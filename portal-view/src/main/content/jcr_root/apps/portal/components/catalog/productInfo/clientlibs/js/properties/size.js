var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.size = {

        'loadDialog': function (fieldOpions) {
            return new CQ.form.CatalogSizeField({
                widthParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                heightParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                heightSuffix: fieldOpions.units || '',
                widthSuffix: fieldOpions.units || '',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $sizeBlock = $(".templates-properties-storage .portal-field-size").clone();
            $sizeBlock.find(".sortAttrName").text(filterItem.filterName);
            $sizeBlock.find(".units").text(filterItem.units);
            sortArrays.startParamArray.forEach(function (startItem) {
                $sizeBlock.find(".startSelectFilter").append("<option>"+startItem+"</option>");
            });
            sortArrays.endParamArray.forEach(function (endItem) {
                $sizeBlock.find(".endSelectFilter").append("<option>"+endItem+"</option>");
            });
            return $sizeBlock;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);

