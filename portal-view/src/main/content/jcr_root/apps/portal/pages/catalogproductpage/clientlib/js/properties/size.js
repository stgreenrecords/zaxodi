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
                propertyUnits: fieldOpions.units,
                propertyGroup: fieldOpions.group,
                propertyExclude: fieldOpions.exclude.length > 0
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $sizeBlock = $(".templates-properties-storage .portal-field-size").clone();
            $sizeBlock.find(".sortAttrName").text(filterItem.name);
            $sizeBlock.find(".units").text(filterItem.units);
            sortArrays.startParamArray.forEach(function (startItem) {
                $sizeBlock.find(".startSelectFilter").append("<option>"+startItem+"</option>");
            });
            sortArrays.endParamArray.forEach(function (endItem) {
                $sizeBlock.find(".endSelectFilter").append("<option>"+endItem+"</option>");
            });
            return $sizeBlock;
        },

        'doFilter': function (selectedFilter, productList) {
            var startSelectedValue = parseFloat($(selectedFilter).find("select.startSelectFilter option:selected").text());
            var endSelectedValue = parseFloat($(selectedFilter).find("select.endSelectFilter option:selected").text());
            var propertyName = selectedFilter.find(".sortAttrName").text();
            var resultProductList = [];
            if (startSelectedValue || endSelectedValue) {
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

