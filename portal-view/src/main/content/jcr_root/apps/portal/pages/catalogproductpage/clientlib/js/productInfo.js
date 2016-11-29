var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.ProductInfo = {};

    PORTAL.modules.ProductInfo.selfSelector = "#photo-grid-gallery";

    PORTAL.modules.ProductInfo.init = function ($self) {

        console.log('Component: "ProductInfo"');

        $($self).find('img').each(function () {
            $(this).load(function () {
                if ($(this).height() <= $(this).width()) {
                    $(this).addClass('landscape');
                }
            });
        });

        $self.magnificPopup({
            delegate: 'a',
            type: 'image',
            closeOnContentClick: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 300, // don't foget to change the duration also in CSS
                opener: function (element) {
                    return element.find('img');
                }
            }
        });

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

        var currentPagePath = location.href;
        var brandPage = currentPagePath.substring(0, currentPagePath.lastIndexOf("/"));
        var categoryPage = brandPage.substring(0, brandPage.lastIndexOf("/"));
        var requestedURL = categoryPage + "/jcr:content.json";
        $.ajax({
            url: requestedURL,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    var arrayProperty = data.properties instanceof Array ? data.properties : [data.properties];

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

                            field = PORTAL.catalogStorage.properties[fieldOpions.typeSelection].loadDialog(fieldOpions);

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