var PORTAL = (function (PORTAL, $) {

    PORTAL.catalogStorage = PORTAL.catalogStorage || {};

    PORTAL.catalogStorage.properties = PORTAL.catalogStorage.properties || {};

    PORTAL.catalogStorage.properties.numberBoolean = {

        'loadDialog' : function(fieldOpions) {
            return new CQ.form.CatalogBooleanNumberField({
                fieldLabel: fieldOpions.valueSelection,
                booleanParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                countParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                itemID: 'property',
                name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                countPrefix: 'Количество:',
                booleanPrefix: 'Присутствует:',
                propertyType: fieldOpions.typeSelection,
                propertyUnits: fieldOpions.units,
            });
        },

        'filterDraw': function filterDraw(filterItem, valueArray, sortArrays) {
            var $numberBooleanBlock = $(".templates-properties-storage .portal-field-numberBoolean").clone();
            $numberBooleanBlock.find(".sortAttrName").text(filterItem.filterName);
            if (filterItem.count && filterItem.count == 1) {
                $numberBooleanBlock.find(".inputFilter").remove();
            }
            var $checkbox = $numberBooleanBlock.find(".filterCheckbox").change(function () {
                var countInput = $(this).siblings(".countInput");
                if (!$(this).prop('checked')) {
                    if (countInput && (countInput.val() > 0)) {
                        countInput.val('');
                    }
                } else {
                    if (countInput && (countInput.val() < 1)) {
                        countInput.val(1);
                    }
                }
            });
            var $inputCount = $numberBooleanBlock.find(".countInput").change(function () {
                var checkbox = $(this).siblings(".filterCheckbox");
                if ($(this).val() < 1) {
                    $(this).val('1');
                }
                if (!isNaN($(this).val())) {
                    checkbox.prop('checked', true);
                } else {
                    checkbox.prop('checked', false);
                }
            });
            return $numberBooleanBlock;
        },

        'doFilter': function (selectedFilter, productList) {
            var isChecked = $(selectedFilter).find(".filterCheckbox").prop("checked");
            var count = parseInt($(selectedFilter).find(".countInput").val());
            var propertyName = selectedFilter.find(".sortAttrName").text();
            var resultProductList = [];
            if (isChecked) {
                count = count || 1;
                var value = $(this).parent().find(".short-list-item-title").text();
                productList.forEach(function (item, index) {
                    item.properties.forEach(function (proterty) {
                        if (proterty.propertyName == propertyName) {
                            var propValue = proterty.propertyValue.indexOf("true") !=-1 ? proterty.propertyValue.split(",")[1] : 0;
                            if (count <=  propValue) {
                                resultProductList.push(item);
                            }
                        }
                    });
                });
            }
            return resultProductList;
        },

        'isFilterEmpty': function (selectedFilter) {
            var isChecked = $(selectedFilter).find(".filterCheckbox").prop("checked");
            return !isChecked;
        }


    }

    return PORTAL;

})(PORTAL || {}, jQuery);

/*
<div class="sortItem portal-field-numberBoolean">
    <div class="sortAttrName"></div>
    <input type="checkbox" class="filterCheckbox">
    <input class="inputFilter countInput" type="number" placeholder="количество">
    </div>*/
