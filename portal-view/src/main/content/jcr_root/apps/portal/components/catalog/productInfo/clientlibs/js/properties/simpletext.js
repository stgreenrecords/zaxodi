var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.simpletext = {

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
            $simpletextBlock.find(".sortAttrName").text(filterItem.filterName);
            $mainListItem = $simpletextBlock.find(".filter-list-item").clone();
            $simpletextBlock.find(".filter-list-item").remove();
            $innerListItem = $simpletextBlock.find(".full-list-item").clone();
            $simpletextBlock.find(".full-list-item").remove();
            var $buttonContainer = $simpletextBlock.find(".button-count-all");
            var $fullListContainer = $simpletextBlock.find(".full-list-container");
            valueArray.forEach(function (valueItem, counter) {
                if (counter < 4 ){
                    $mainListItem.find(".short-list-item-title").text(valueItem.value);
                    $simpletextBlock.find(".filter-list").append($mainListItem.clone());
                }
                $innerListItem.find(".full-list-item-title").text(valueItem.value);
                $simpletextBlock.find(".full-list-container").append($innerListItem.clone());

            });
            if (valueArray.length > 4) {
                $buttonContainer.find(".button-count-all-insert").text(valueArray.length);
                $buttonContainer.click(function() {
                    $fullListContainer.attr('tabindex',-1).focus(function(){
                    });
                    $fullListContainer.css("display","block");
                    $fullListContainer.focus();
                });
                $fullListContainer.focusout(function() {
                    $(this).css("display","none");
                });
            } else {
                $buttonContainer.remove();
                $fullListContainer.remove();
            }

            return $simpletextBlock;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);


/*<div class="sortItem portal-field-simpletext">
    <div class="sortAttrName"></div>

    <div class="filter-list-wrapper">
    <ul class="filter-list">
    <li class="filter-list-item">
    <input type="checkbox" class="filterCheckbox">
    <span class="short-list-item-title"></span>
    </li>
    </ul>
    <div class="button-count-all">
    <span>Всего&nbsp;</span>
<span class="button-count-all-insert"></span>
    <span>&nbsp;вариантов</span>
<span class="button-count-all-arrow">&#9654;</span>
</div>
<div class="full-list-container">
    <div class="full-list-item">
    <input type="checkbox" class="filterCheckbox">
    <span class="full-list-item-title"></span>
    </div>
    </div>
    </div>
    </div>*/
