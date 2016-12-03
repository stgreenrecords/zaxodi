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
                heightPrefix: 'To',
                widthPrefix: 'From',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units,
                propertyMicroDescription: fieldOpions.microdescription,
                propertyGroup: fieldOpions.group,
                propertyExclude: fieldOpions.exclude.length > 0
            });
        },

        'microDescriptionView' : function(name, value){
            return name + " " + value.replace(",", " - ");
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $intervalBlock = $(".templates-properties-storage .portal-field-interval").clone();
            $intervalBlock.find(".sortAttrName").text(filterItem.name);
            $intervalBlock.find(".units").text(filterItem.units);
            sortArrays.startParamArray.forEach(function (startItem) {
                $intervalBlock.find(".startSelectFilter").append("<option>"+startItem+"</option>");
            });
            sortArrays.endParamArray.forEach(function (endItem) {
                $intervalBlock.find(".endSelectFilter").append("<option>"+endItem+"</option>");
            });
            return $intervalBlock;
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

