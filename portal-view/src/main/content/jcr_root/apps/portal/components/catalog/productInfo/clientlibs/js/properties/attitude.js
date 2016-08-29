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
        },

        'doFilter': function (selectedFilter, productList) {
            var startSelectedValue = parseFloat($(element).find("select.startSelectFilter option:selected").text());
            var endSelectedValue = parseFloat($(element).find("select.endSelectFilter option:selected").text());
            var propertyName = selectedFilter.find(".sortAttrName").text();
            var resultProductList = [];
            selectedValue.each(function () {
                var value = $(this).parent().find(".short-list-item-title").text();
                var matches = false;
                var productForPush;
                productList.forEach(function (item, index) {
                    item.properties.forEach(function (proterty) {
                        if (proterty.propertyName == propertyName && proterty.propertyValue.split(",").includes(value)) {
                            resultProductList.push(item);
                        }
                    });
                });
                if (matches && productForPush) {

                }
            });
            return resultProductList;
        },

        'isFilterEmpty': function (selectedFilter) {
            var startSelectedValue = $(element).find("select.startSelectFilter option:selected").text();
            var endSelectedValue = $(element).find("select.endSelectFilter option:selected").text();
            return (endSelectedValue == "Выбрать" && startSelectedValue == "Выбрать")
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
