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
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $simpletextBlock, $enumBlock, $numberBooleanBlock, $numberBlock, $floatBlock, $intervalBlock, $attitudeBlock, $sizeBlock) {
            $floatBlock.find(".sortAttrName").text(filterItem.filterName);
            $floatBlock.find(".units").text(filterItem.units);
            return $floatBlock;
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
