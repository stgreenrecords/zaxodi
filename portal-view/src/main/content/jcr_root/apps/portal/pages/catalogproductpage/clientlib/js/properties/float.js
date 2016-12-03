var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.float = {

        'loadDialog': function (fieldOpions) {
            return new CQ.Ext.form.TextField({
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units,
                propertyGroup: fieldOpions.group,
                propertyMicroDescription: fieldOpions.microdescription,
                propertyExclude: fieldOpions.exclude.length > 0
            });
        },

        'microDescriptionView' : function(name, value){
            return name + " " + value;
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $floatBlock = $(".templates-properties-storage .portal-field-float").clone();
            $floatBlock.find(".sortAttrName").text(filterItem.name);
            $floatBlock.find(".units").text(filterItem.units);
            return $floatBlock;
        },

        'doFilter': function (selectedFilter, productList) {
            var startSelectedValue = parseFloat($(selectedFilter).find(".numberStartInput").val());
            var endSelectedValue = parseFloat($(selectedFilter).find(".numberEndInput").val());
            var propertyName = selectedFilter.find(".sortAttrName").text();
            var resultProductList = [];
            if (startSelectedValue || endSelectedValue) {
                productList.forEach(function (item, index) {
                    item.properties.forEach(function (proterty) {
                        if (proterty.name == propertyName) {
                            var value = parseFloat(proterty.value);
                            if ( (!startSelectedValue || value >= startSelectedValue) && ( !endSelectedValue || value <= endSelectedValue) ){
                                resultProductList.push(item);
                            }
                        }
                    });
                });
            }
            return resultProductList;
        },

        'isFilterEmpty': function (selectedFilter) {
            var startSelectedValue = $(selectedFilter).find(".numberStartInput").val();
            var endSelectedValue = $(selectedFilter).find(".numberEndInput").val();
            return (!endSelectedValue && !startSelectedValue);
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);

/*<div class="sortItem portal-field-float">
 <div class="sortAttrName"></div>
 <span class="units"></span>
 <div class="inputs-storage">
 <input class="inputFilter numberStartInput" type="text" placeholder="от">
 <input class="inputFilter numberEndInput" type="text" placeholder="до">
 </div>
 </div>*/
