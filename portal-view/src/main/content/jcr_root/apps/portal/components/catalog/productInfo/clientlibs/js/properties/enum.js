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

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $enumBlock = $(".templates-properties-storage .portal-field-enum").clone();
            $enumBlock.find(".sortAttrName").text(filterItem.filterName);
            $mainListItem = $enumBlock.find(".filter-list-item").clone();
            $enumBlock.find(".filter-list-item").remove();
            $innerListItem = $enumBlock.find(".full-list-item").clone();
            $enumBlock.find(".full-list-item").remove();
            var $buttonContainer = $enumBlock.find(".button-count-all");
            var $fullListContainer = $enumBlock.find(".full-list-container");
            valueArray.forEach(function (valueItem, counter) {
                if (counter < 4 ){
                    $mainListItem.find(".short-list-item-title").text(valueItem.value);
                    $enumBlock.find(".filter-list").append($mainListItem.clone());
                }
                $innerListItem.find(".full-list-item-title").text(valueItem.value);
                $enumBlock.find(".full-list-container").append($innerListItem.clone());

            });
            if (valueArray.length > 4) {
                $buttonContainer.find(".button-count-all-insert").text(valueArray.length);
                $buttonContainer.click(function() {
                    $fullListContainer.css("display","block");
                });
                $(document).click(function(event){
                    var target = $(event.target);
                    if (!target.hasClass("enum")){
                        $fullListContainer.css("display","none");
                    }
                });
            } else {
                $buttonContainer.remove();
                $fullListContainer.remove();
            }

            return $enumBlock;
        },

        'doFilter': function (selectedFilter, productList) {
            var selectedValue = selectedFilter.find(".filterCheckbox:checked");
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
            });
            return resultProductList;
        },

        'isFilterEmpty': function (selectedFilter) {
            var selectedValue = selectedFilter.find(".filterCheckbox:checked");
            return selectedValue.length == 0;
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
