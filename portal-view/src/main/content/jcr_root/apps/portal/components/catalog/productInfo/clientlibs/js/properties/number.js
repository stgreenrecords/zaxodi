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
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $numberBlock = $(".templates-properties-storage .portal-field-number").clone();
            $numberBlock.find(".sortAttrName").text(filterItem.filterName);
            $numberBlock.find(".units").text(filterItem.units);
            return $numberBlock;
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

