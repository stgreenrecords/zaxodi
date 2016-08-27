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
