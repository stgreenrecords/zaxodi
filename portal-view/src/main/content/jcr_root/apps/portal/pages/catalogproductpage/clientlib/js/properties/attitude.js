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
                widthPrefix: 'Attitude:',
                fieldWidth: 60,
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units,
                propertyGroup: fieldOpions.group,
                propertyExclude: fieldOpions.exclude.length > 0
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $attitudeBlock = $(".templates-properties-storage .portal-field-attitude").clone();
            $attitudeBlock.find(".sortAttrName").text(filterItem.name);
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
            var startSelectedValue = parseFloat($(selectedFilter).find("select.startSelectFilter option:selected").text());
            var endSelectedValue = parseFloat($(selectedFilter).find("select.endSelectFilter option:selected").text());
            var propertyName = selectedFilter.find(".sortAttrName").text();
            var resultProductList = [];
            if (startSelectedValue || endSelectedValue) {
                    var value = $(this).parent().find(".short-list-item-title").text();
                    productList.forEach(function (item, index) {
                        item.properties.forEach(function (proterty) {
                            if (proterty.name == propertyName) {
                                var startValue = parseFloat(proterty.value.split(",")[0]);
                                var endValue = parseFloat(proterty.value.split(",")[1]);
                                if ( (!startSelectedValue || startValue >= startSelectedValue) && ( !endSelectedValue || endValue <= endSelectedValue) ){
                                    resultProductList.push(item);
                                }
                            }
                        });
                    });
            }
            return resultProductList;
        },

        'isFilterEmpty': function (selectedFilter) {
            var startSelectedValue = $(selectedFilter).find("select.startSelectFilter option:selected").text();
            var endSelectedValue = $(selectedFilter).find("select.endSelectFilter option:selected").text();
            return (endSelectedValue == "Select" && startSelectedValue == "Select");
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
