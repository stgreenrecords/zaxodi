var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.enum = {

        'loadDialog': function (fieldOpions) {
            return new CQ.form.MultiField({
                fieldConfig: {"xtype": "textfield"},
                fieldLabel: fieldOpions.valueSelection,
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                itemID: 'property',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays, $simpletextBlock, $enumBlock, $numberBooleanBlock, $numberBlock, $floatBlock, $intervalBlock, $attitudeBlock, $sizeBlock) {
            $enumBlock.find(".sortAttrName").text(filterItem.filterName);
            $mainListItem = $enumBlock.find(".filter-list-item").clone();
            $enumBlock.find(".filter-list-item").remove();
            $innerListItem = $enumBlock.find(".full-list-item").clone();
            $enumBlock.find(".full-list-item").remove();
            valueArray.forEach(function (valueItem, counter) {
                if (counter < 4 ){
                    $mainListItem.find(".short-list-item-title").text(valueItem.value);
                    $enumBlock.find(".filter-list").append($mainListItem.clone());
                }
                $innerListItem.find(".full-list-item-title").text(valueItem.value);
                $enumBlock.find(".full-list-container").append($innerListItem.clone());

            });
            if (valueArray.length > 4) {
                $enumBlock.find(".button-count-all-insert").text(valueArray.length);
            } else {
                $enumBlock.find(".button-count-all").remove();
                $enumBlock.find(".full-list-container").remove();
            }

            return $enumBlock;
        }

    }

    return PORTAL;

})(PORTAL || {}, jQuery);

/*
<div class="sortItem portal-field-enum">
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
