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

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $simpletextBlock, $enumBlock, $numberBooleanBlock, $numberBlock, $floatBlock, $intervalBlock, $attitudeBlock, $sizeBlock) {
            $intervalBlock.find(".sortAttrName").text(filterItem.filterName);
            $intervalBlock.find(".units").text(filterItem.units);
            sortArrays.startParamArray.forEach(function (startItem) {
                $intervalBlock.find(".startSelectFilter").append("<option>"+startItem+"</option>");
            });
            sortArrays.endParamArray.forEach(function (endItem) {
                $intervalBlock.find(".endSelectFilter").append("<option>"+endItem+"</option>");
            });
            return $intervalBlock;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);

