var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.ProductInfo = {};

    PORTAL.modules.ProductInfo.init = function () {
        console.log('Component: "ProductInfo"');
    }

    PORTAL.modules.ProductInfo.submitDialog = function (dialog) {
        var properties = dialog.findBy(function (comp) {
            return comp["itemID"] == 'property';
        }, dialog);
        var resultArrayProperties = [];
        var resultHidden = dialog.findBy(function (comp) {
            return comp["name"] == './results';
        }, dialog);

        var checkboxs = dialog.findBy(function (comp) {
            return comp["paramToSearch"] == 'search';
        }, dialog);
        properties.forEach(function (itemArray) {
            if (itemArray.getValue()) {
                var itemName = itemArray.fieldLabel;
                var itemValue = itemArray.getValue();
                var propertyUnits = itemArray.propertyUnits || "";
                var propertyType = itemArray.propertyType;
                if (propertyType == 'numberBoolean') {
                    var value;
                    if (itemValue.match("true")) {
                        value = itemValue.substring(5, itemValue.length);
                    } else {
                        value = itemValue.substring(1, itemValue.length);
                    }

                    if (value == '') {
                        itemValue = 'true,0'
                    }
                }
                resultArrayProperties.push("{'propertyName':'" + itemName + "','propertyValue':'" + itemValue + "','propertyType':'" + propertyType + "','units':'" + propertyUnits + "'}");
            }
        });


        checkboxs.forEach(function (itemArray) {
            if (!itemArray.checked) {
                ownField = itemArray.ownerCt;
                resultArrayProperties.push("{'propertyName':'" + ownField.fieldLabel + "','propertyValue':'Off','propertyType':'" + ownField.propertyType + "','units':'" + ownField.propertyUnits + "'}");
            }
        });

        resultHidden[0].setValue("[" + resultArrayProperties + "]");

    }

    PORTAL.modules.ProductInfo.loadDialogComponents = function (dialog) {
        console.log("HELLO");
        var currentPagePath = location.href;
        var parrentPath = currentPagePath.substring(0, currentPagePath.lastIndexOf("/"));
        var requestedURL = parrentPath + "/jcr:content/columns/parsys0/productlist.json";
        $.ajax({
            url: requestedURL,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    var arrayProperty = data.properties;
                    var panel = dialog.findBy(function (comp) {
                        return comp["jcr:primaryType"] == "cq:Panel";
                    }, dialog);

                    var isHiddenFiledExist = dialog.findBy(function (comp) {
                        return comp["name"] == './results';
                    }, dialog);
                    if (isHiddenFiledExist.length == 0) {
                        var hiddenField = new CQ.Ext.form.Hidden({
                            name: './results'
                        });
                        panel[0].insert(2, hiddenField);
                    }

                    var field;
                    arrayProperty.forEach(function (item, i, arr) {
                        var fieldOpions = JSON.parse(item);
                        var isExist = dialog.findBy(function (comp) {
                            return comp["name"] == './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '');
                        }, dialog);
                        var isMultiExistH = dialog.findBy(function (comp) {
                            return comp["name"] == './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H';
                        }, dialog);
                        var isMultiExistW = dialog.findBy(function (comp) {
                            return comp["name"] == './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W';
                        }, dialog);
                        if (isExist.length == 0 && isMultiExistH.length == 0 && isMultiExistW.length == 0) {
                            if (fieldOpions.typeSelection == 'simpletext') {
                                field = new CQ.Ext.form.TextField({
                                    name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                                    fieldLabel: fieldOpions.valueSelection,
                                    itemID: 'property',
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }

                            if (fieldOpions.typeSelection == 'float') {
                                field = new CQ.Ext.form.TextField({
                                    name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                                    fieldLabel: fieldOpions.valueSelection,
                                    itemID: 'property',
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }

                            if (fieldOpions.typeSelection == 'number') {
                                field = new CQ.Ext.form.NumberField({
                                    name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                                    fieldLabel: fieldOpions.valueSelection,
                                    itemID: 'property',
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }


                            if (fieldOpions.typeSelection == 'size') {
                                field = new CQ.form.CatalogSizeField({
                                    widthParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                                    heightParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                                    fieldLabel: fieldOpions.valueSelection,
                                    itemID: 'property',
                                    heightSuffix: fieldOpions.units || '',
                                    widthSuffix: fieldOpions.units || '',
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }

                            if (fieldOpions.typeSelection == 'attitude') {
                                field = new CQ.form.CatalogSizeField({
                                    widthParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                                    heightParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                                    fieldLabel: fieldOpions.valueSelection,
                                    itemID: 'property',
                                    heightSuffix: fieldOpions.units || '',
                                    heightPrefix: '/',
                                    widthPrefix: 'Отношение:',
                                    fieldWidth: 60,
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }

                            if (fieldOpions.typeSelection == 'interval') {
                                field = new CQ.form.CatalogSizeField({
                                    widthParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'H',
                                    heightParameter: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, '') + 'W',
                                    fieldLabel: fieldOpions.valueSelection,
                                    itemID: 'property',
                                    heightSuffix: fieldOpions.units || '',
                                    widthSuffix: fieldOpions.units || '',
                                    heightPrefix: 'До',
                                    widthPrefix: 'От',
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }


                            if (fieldOpions.typeSelection == 'numberBoolean') {
                                field = new CQ.form.CatalogBooleanNumberField({
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
                            }

                            if (fieldOpions.typeSelection == 'enum') {
                                field = new CQ.form.MultiField({
                                    fieldConfig: {"xtype": "textfield"},
                                    fieldLabel: fieldOpions.valueSelection,
                                    name: './' + encodeURI(fieldOpions.valueSelection).replace(/\%/g, ''),
                                    itemID: 'property',
                                    propertyType: fieldOpions.typeSelection,
                                    propertyUnits: fieldOpions.units
                                });
                            }


                            panel[0].insert(2, field);
                        }
                    });
                    panel[0].doLayout();
                }
            }
        });

    }

    return PORTAL;

})(PORTAL || {}, jQuery);