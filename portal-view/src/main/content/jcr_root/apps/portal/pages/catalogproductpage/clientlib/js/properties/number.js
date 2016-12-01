var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.number = {

        'loadDialog' : function(fieldOpions) {
            return new CQ.Ext.form.NumberField({
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                fieldLabel: fieldOpions.valueSelection,
                itemID: 'property',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units,
                propertyGroup: fieldOpions.group,
                propertyExclude: fieldOpions.exclude.length > 0
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $numberBlock = $(".templates-properties-storage .portal-field-number").clone();
            $numberBlock.find(".sortAttrName").text(filterItem.name);
            $numberBlock.find(".units").text(filterItem.units);
            return $numberBlock;
        },

        'doFilter': function (selectedFilter, productList) {
            var startSelectedValue = $(selectedFilter).find(".numberStartInput").val();
            var endSelectedValue = $(selectedFilter).find(".numberEndInput").val();
            var propertyName = selectedFilter.find(".sortAttrName").text();
            var resultProductList = [];
            if (startSelectedValue || endSelectedValue) {
                productList.forEach(function (item, index) {
                    item.properties.forEach(function (proterty) {
                        if (proterty.name == propertyName) {
                            var value = parseInt(proterty.value);
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

/*<div class="sortItem portal-field-number">
 <div class="sortAttrName"></div>
 <span class="units"></span>
 <div class="inputs-storage">
 <input class="inputFilter numberStartInput" type="number" placeholder="от">
 <input class="inputFilter numberEndInput" type="number" placeholder="до">
 </div>
 </div>*/

