var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.attitude = {

        'loadDialog': function (fieldOpions) {
            return new CQ.form.CatalogSizeField({
                widthParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                heightParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                heightSuffix: fieldOpions.units || '',
                heightPrefix: '/',
                widthPrefix: 'Отношение:',
                fieldWidth: 60,
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $attitudeBlock = $(".templates-properties-storage .portal-field-attitude").clone();
            $attitudeBlock.find(".sortAttrName").text(filterItem.filterName);
            $attitudeBlock.find(".units").text(filterItem.units);
            sortArrays.startParamArray.forEach(function (startItem) {
                $attitudeBlock.find(".startSelectFilter").append("<option>"+startItem+"</option>");
            });
            sortArrays.endParamArray.forEach(function (endItem) {
                $attitudeBlock.find(".endSelectFilter").append("<option>"+endItem+"</option>");
            });
            return $attitudeBlock;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);


/*<div class="sortItem portal-field-attitude">
    <div class="sortAttrName"></div>
    <span class="units"></span>
    <div class="inputs-storage">
    <select class="startSelectFilter">
    <option>Выбрать</option>
    </select>
    /
    <select class="endSelectFilter">
    <option>Выбрать</option>
    </select>
    </div>
    </div>*/
