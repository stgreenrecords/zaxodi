var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.ProductList = {};

    PORTAL.modules.ProductList.init = function () {

        console.log('Component: "ProductList"');

        var $self = $(".product-list-block");
        var $filterPrice = $self.find("div#filterPrice").change(function () {
            doFilter({
                filterType: "number",
                filterName: "Цена"
            }, this);
        });
        var $filterBrand = $self.find("div#filterBrand").change(function () {
            doFilter({
                filterType: "simpletext",
                filterName: "Марка(Бренд)"
            }, this);
        });
        var $filterModel = $self.find("div#filterModel").change(function () {
            doFilter({
                filterType: "simpletext",
                filterName: "Модель"
            }, this);
        });
        var $itemProductList = $self.find("div.itemProductList");
        var $sortPropertiesFilter = $self.find("div.sortPropertiesFilter");

        var currentPagePosition;
        var countOfPage;

        var $countOfProducts = $self.find(".number-of-product");

        var pathWithExtension = window.location.pathname;
        var pathWithOutExtension = pathWithExtension.substring(0, pathWithExtension.indexOf(".html"));

        var categoryData;
        var productItems;
        var filterProperties;

        var COUNT_PRODUCT_ON_PAGE = 30;

        var currentFilterItems = {};

        var filteriedData;

        $.ajax({
            type: "GET",
            url: "/services/productlist." + $self.data("category") + ".json",
            headers: {
                "categoryPath": pathWithOutExtension
            },
            dataType: "json",
            success: function (data) {
                categoryData = data;
                filterProperties = categoryData.filterProperties || [];
                productItems = categoryData.items || [];
                filteriedData = productItems.slice();
                changeCountOfProducts(productItems.length);
                drawFilters();
                drawProductList();
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });

        var drawFilters = function () {

            if (filterProperties) {
                filterProperties.forEach(function (filterItem) {
                    var $sortItemDiv = $("<div>").addClass("sortItem");
                    $sortItemDiv.change(function () {
                        doFilter(filterItem, this);
                    });
                    var $spanSortAttrName = $("<div>").attr("filterType", filterItem.filterType).text(filterItem.filterName).addClass("sortAttrName");
                    var $spanUnits = $("<span>").addClass("units");
                    if (filterItem.units) {
                        $spanUnits.text(" (" + filterItem.units + ")");
                    }
                    var $br = $("</br>");
                    var $select = $("<select>");
                    var $endSelect = $("<select class='startSelectFilter'><options>Выбрать</option></select>");
                    var $option = $("<option>");
                    var $defaultSelectOption = $("<option>").text("Выбрать");
                    var $inputStartParam = $("<input>").addClass("inputFilter numberStartInput").attr("type", "number").attr("placeholder", "от");
                    var $inputEndParam = $("<input>").addClass("inputFilter numberEndInput").attr("type", "number").attr("placeholder", "до");
                    var $inputStartParamFloat = $("<input>").addClass("inputFilter numberStartInput").attr("type", "text").attr("placeholder", "от");
                    var $inputEndParamFloat = $("<input>").addClass("inputFilter numberEndInput").attr("type", "text").attr("placeholder", "до");
                    var $inputsStorage = $("<div>").addClass("inputs-storage");
                    var $checkbox = $("<input>").attr("type", "checkbox").addClass("filterCheckbox").change(function () {
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
                    var $inputCount = $("<input>").addClass("inputFilter countInput").attr("type", "number").attr("placeholder", "количество").change(function () {
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

                    var valueArray = filterItem.values || [];
                    if (filterItem.filterName == 'Марка(Бренд)') {
                        if (valueArray.length > 0) {
                            valueArray.forEach(function (valueItem) {
                                var optionBrand = $("<option>").text(valueItem.value);
                                $($filterBrand).find("select").append(optionBrand);
                            });
                        }
                    } else {
                        if (filterItem.filterName == 'Модель') {
                            if (valueArray.length > 0) {
                                valueArray.forEach(function (valueItem) {
                                    var optionBrand = $("<option>").text(valueItem.value);
                                    $($filterModel).find("select").append(optionBrand);
                                });
                            }
                        } else {
                            switch (filterItem.filterType) {
                                case 'size':
                                    var sortArrays = splitOnTwoArrayAndSort(valueArray);
                                    if (sortArrays.startParamArray && sortArrays.endParamArray) {
                                        filterItem.startParamArray = sortArrays.startParamArray;
                                        filterItem.endParamArray = sortArrays.endParamArray;
                                        var $startSelect = $("<select>").addClass("startSelectFilter").append("<option>Выбрать</option>");
                                        var $endSelect = $("<select>").addClass("endSelectFilter").append("<option>Выбрать</option>");
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($inputsStorage.append($startSelect).append(" x ").append($endSelect)));
                                        sortArrays.startParamArray.forEach(function (startItem) {
                                            $startSelect.append($("<option>" + startItem + "</option>"));
                                        });
                                        sortArrays.endParamArray.forEach(function (endItem) {
                                            $endSelect.append($("<option>" + endItem + "</option>"));
                                        });
                                    }
                                    break;
                                case 'simpletext':
                                    if (valueArray.length > 0) {
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($select.append($defaultSelectOption)));
                                        valueArray.forEach(function (valueItem) {
                                            var $enumOption = $("<option>").text(valueItem.value);
                                            $($select).append($enumOption);
                                        });
                                    }
                                    break;
                                case 'interval':
                                    var sortArrays = splitOnTwoArrayAndSort(valueArray);
                                    if (sortArrays.startParamArray && sortArrays.endParamArray) {
                                        filterItem.startParamArray = sortArrays.startParamArray;
                                        filterItem.endParamArray = sortArrays.endParamArray;
                                        var $startSelect = $("<select>").addClass("startSelectFilter").append("<option>Выбрать</option>");
                                        var $endSelect = $("<select>").addClass("endSelectFilter").append("<option>Выбрать</option>");
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($inputsStorage.append($startSelect).append(" - ").append($endSelect)));
                                        sortArrays.startParamArray.forEach(function (startItem) {
                                            $startSelect.append($("<option>" + startItem + "</option>"));
                                        });
                                        sortArrays.endParamArray.forEach(function (endItem) {
                                            $endSelect.append($("<option>" + endItem + "</option>"));
                                        });
                                    }
                                    break;
                                case 'attitude':
                                    var sortArrays = splitOnTwoArrayAndSort(valueArray);
                                    if (sortArrays.startParamArray && sortArrays.endParamArray) {
                                        filterItem.startParamArray = sortArrays.startParamArray;
                                        filterItem.endParamArray = sortArrays.endParamArray;
                                        var $startSelect = $("<select>").addClass("startSelectFilter").append("<option>Выбрать</option>");
                                        var $endSelect = $("<select>").addClass("endSelectFilter").append("<option>Выбрать</option>");
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($inputsStorage.append($startSelect).append(" / ").append($endSelect)));
                                        sortArrays.startParamArray.forEach(function (startItem) {
                                            $startSelect.append($("<option>" + startItem + "</option>"));
                                        });
                                        sortArrays.endParamArray.forEach(function (endItem) {
                                            $endSelect.append($("<option>" + endItem + "</option>"));
                                        });
                                    }
                                    break;
                                case 'enum':
                                    if (valueArray.length > 0) {
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($select.append($defaultSelectOption)));
                                        valueArray.forEach(function (valueItem) {
                                            var $enumOption = $("<option>").text(valueItem.value);
                                            $($select).append($enumOption);
                                        });
                                    }
                                    break;
                                case 'number':
                                    $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($inputsStorage.append($inputStartParam).append($inputEndParam)));
                                    break;
                                case 'float':
                                    $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($inputsStorage.append($inputStartParamFloat).append($inputEndParamFloat)));
                                    break;
                                case 'numberBoolean':
                                    if (filterItem.count && filterItem.count == 1) {
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($checkbox));
                                    }
                                    if (filterItem.count && filterItem.count > 1) {
                                        $sortPropertiesFilter.append($sortItemDiv.append($spanSortAttrName).append($spanUnits).append($checkbox).append($inputCount));
                                    }
                                    break;
                            }

                        }
                    }
                });
            }
        };

        var splitOnTwoArrayAndSort = function (filterValueArray) {
            var startParamArray = [];
            var endParamArray = [];
            filterValueArray.forEach(function (valueItem) {
                var splitValue = valueItem.value.split(",");
                var parseValueFirst = parseFloat(splitValue[0]);
                var parseValueSecond = parseFloat(splitValue[1]);
                if (splitValue[0] && startParamArray.indexOf(parseValueFirst) == -1) {
                    startParamArray.push(parseFloat(parseValueFirst));
                }
                if (splitValue[1] && endParamArray.indexOf(parseValueSecond) == -1) {
                    endParamArray.push(parseFloat(parseValueSecond));
                }
            });
            function compareNumbers(firstValue, secondValue) {
                return firstValue - secondValue;
            }

            var resultSortArrays = {
                'startParamArray': startParamArray.sort(compareNumbers),
                'endParamArray': endParamArray.sort(compareNumbers)
            };
            return resultSortArrays;
        }

        var drawProductList = function () {
            currentPagePosition = 1;
            $itemProductList.find(".itemBlock").remove();
            $itemProductList.find("#paggination").remove()
            if (filteriedData.length > 0 && filteriedData.length < COUNT_PRODUCT_ON_PAGE) {
                filteriedData.forEach(function (item) {
                    drawItem(item);
                });
            } else {
                if (filteriedData.length > 0) {
                    for (var i = 0; i < COUNT_PRODUCT_ON_PAGE; i++) {
                        drawItem(filteriedData[i]);
                    }
                }
            }
            if (((filteriedData.length / COUNT_PRODUCT_ON_PAGE) - Math.round(filteriedData.length / COUNT_PRODUCT_ON_PAGE)) > 0) {
                countOfPage = Math.round(filteriedData.length / COUNT_PRODUCT_ON_PAGE) + 1;
            } else {
                countOfPage = Math.round(filteriedData.length / COUNT_PRODUCT_ON_PAGE);
            }
            if (filteriedData.length > COUNT_PRODUCT_ON_PAGE) {
                pagginationDraw();
            }

        };

        var pagginationDraw = function () {
            var $currentPage = $("<span class='currentPage'>Страница " + currentPagePosition + " из " + countOfPage + "</span>");
            var $showAllPages = $("<input class='showAllPages' type='button' value='Показать все' />").click(function () {
                $itemProductList.find(".itemBlock").remove();
                $itemProductList.find("#paggination").remove();
                filteriedData.forEach(function (item) {
                    drawItem(item);
                });
            });
            var $onFirstPage = $("<input class='onFirstPage' type='button' value='В начало' />").click(function () {
                $itemProductList.find(".itemBlock").remove();
                $itemProductList.find("#paggination").remove();
                for (var i = 0; i < COUNT_PRODUCT_ON_PAGE; i++) {
                    drawItem(filteriedData[i]);
                }
                currentPagePosition = 1;
                pagginationDraw();
            });
            var $paggination = $("<div id='paggination'></div>");
            var $pagginationBackIMG = $("<img src='/content/dam/portal/catalog/back.png' />").click(function () {
                loadPreviusPage();
            });
            var $pagginationForwardIMG = $("<img src='/content/dam/portal/catalog/forward.png' />").click(function () {
                loadNextPage();
            });
            $paggination.append($currentPage);
            if (currentPagePosition > 1 && currentPagePosition != countOfPage) {
                $paggination.append($("<div class='pagginationBack'></div>").append($pagginationBackIMG).append($pagginationForwardIMG));
            }
            if (currentPagePosition == 1 && countOfPage != currentPagePosition) {
                $paggination.append($("<div class='pagginationForward'></div>").append($pagginationForwardIMG));
                $paggination.find(".pagginationBlack").remove();
            }
            if (currentPagePosition == countOfPage && currentPagePosition != 1) {
                $paggination.find(".pagginationForward").remove();
                $paggination.append($("<div class='pagginationBack'></div>").append($pagginationBackIMG))
            }
            if (countOfPage == 1) {
                $paggination.remove($showAllPages);
            } else {
                $itemProductList.append($paggination.append($showAllPages));
            }

            if (currentPagePosition > 2) {
                $paggination.append($onFirstPage);
            }

        }

        var drawItem = function (item) {
            var discription = " ";
            if (item.properties && item.properties.length > 10) {
                for (var i = 0; i < 10; i++) {
                    if (i != 9) {
                        discription += "<span class='discriptionName'>" + item.properties[i].propertyName + "</span> <span class='discriptionValue'>" + item.properties[i].propertyValue + "</span>&nbsp;|&nbsp; ";
                    } else {
                        discription += "<span class='discriptionName'>" + item.properties[i].propertyName + "</span> <span class='discriptionValue'>" + item.properties[i].propertyValue + "</span>.";
                    }
                }
            }

            var priceMessage;
            if (item.price) {
               priceMessage = item.price + " рублей.";
            } else {
              priceMessage = "Цена не указана.";
            }
            $itemProductList.append($("" +
                "<div class='itemBlock'>" +
                "   <div class='item-image'>" +
                        "<div class='item-product-title'><a href='" + item.path + ".html" + "' class='itemTitle'>" + item.brand + " " + item.model + "</a></div>" +
                        "<img class='itemImage' src='" + item.image + "' alt='img'>" +
                "   </div>" +
                "   <div class='itemDiscription'>" + discription + "</div>" +
                "   <div class='itemPriceBlock'>" + priceMessage + "</div>" +
                "   </div>" +
                "</div>"));
        };

        var changeCountOfProducts = function (count) {
            $countOfProducts.text("Всего " + count + " моделей");
        };

        var loadNextPage = function () {
            $itemProductList.find(".itemBlock").remove();
            $itemProductList.find("#paggination").remove();
            var startPosition = currentPagePosition * COUNT_PRODUCT_ON_PAGE;
            var endPosition = currentPagePosition * COUNT_PRODUCT_ON_PAGE + COUNT_PRODUCT_ON_PAGE;
            if (endPosition > filteriedData.length) {
                endPosition = filteriedData.length;
            }
            for (var i = startPosition; i < endPosition; i++) {
                drawItem(filteriedData[i]);
            }
            currentPagePosition++;
            pagginationDraw();
            if (currentPagePosition == countOfPage) {
                $itemProductList.find("#paggination .nextPage").remove();
            }
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        };

        var loadPreviusPage = function () {
            $itemProductList.find(".itemBlock").remove();
            $itemProductList.find("#paggination").remove();
            currentPagePosition--;
            var startPosition = currentPagePosition * COUNT_PRODUCT_ON_PAGE - COUNT_PRODUCT_ON_PAGE;
            var endPosition = currentPagePosition * COUNT_PRODUCT_ON_PAGE;
            for (var i = startPosition; i < endPosition; i++) {
                drawItem(filteriedData[i]);
            }
            pagginationDraw();
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        };

        var doFilter = function (filter, element) {
            filteriedData = [];
            if (filter.filterType == "simpletext" || filter.filterType == "enum") {
                var selectedValue = $(element).find("select option:selected").text();
                if (selectedValue != "Выбрать") {
                    currentFilterItems[filter.filterName] = selectedValue;
                } else {
                    delete currentFilterItems[filter.filterName];
                }
            }
            if (filter.filterType == "numberBoolean") {
                currentFilterItems[filter.filterName] = {};
                var checkboxVal = $(element).find(".filterCheckbox").prop("checked");
                var countInputVal = $(element).find(".countInput").val();
                if (checkboxVal && countInputVal) {
                    currentFilterItems[filter.filterName].state = true;
                    currentFilterItems[filter.filterName].count = countInputVal;
                }
                if (checkboxVal && !countInputVal) {
                    currentFilterItems[filter.filterName].state = true;
                }
                if (!checkboxVal) {
                    delete currentFilterItems[filter.filterName];
                }
            }
            if (filter.filterType == "number" || filter.filterType == "float") {
                var startNumberValue = parseFloat($(element).find(".numberStartInput").val());
                var endNumberValue = parseFloat($(element).find(".numberEndInput").val());
                currentFilterItems[filter.filterName] = {};
                if (!isNaN(startNumberValue)) {
                    currentFilterItems[filter.filterName].startNumberValue = startNumberValue;
                } else {
                    if (currentFilterItems[filter.filterName].startNumberValue && !isNaN(endNumberValue)) {
                        delete currentFilterItems[filter.filterName].startNumberValue;
                    }
                }
                if (!isNaN(endNumberValue)) {
                    currentFilterItems[filter.filterName].endNumberValue = endNumberValue;
                } else {
                    if (currentFilterItems[filter.filterName].endNumberValue && !isNaN(startNumberValue)) {
                        delete currentFilterItems[filter.filterName].endNumberValue;
                    }
                }
                if (isNaN(startNumberValue) && isNaN(endNumberValue)) {
                    delete currentFilterItems[filter.filterName];
                }
            }
            if (filter.filterType == "size" || filter.filterType == "interval" || filter.filterType == "interval" || filter.filterType == "attitude") {
                var startSelectedValue = $(element).find("select.startSelectFilter option:selected").text();
                var endSelectedValue = $(element).find("select.endSelectFilter option:selected").text();
                currentFilterItems[filter.filterName] = {};
                if (startSelectedValue != "Выбрать") {
                    currentFilterItems[filter.filterName].startSelectedValue = startSelectedValue;
                } else {
                    if (currentFilterItems[filter.filterName].startSelectedValue && endSelectedValue != "Выбрать") {
                        delete currentFilterItems[filter.filterName].startSelectedValue;
                    }

                }
                if (endSelectedValue != "Выбрать") {
                    currentFilterItems[filter.filterName].endSelectedValue = endSelectedValue;
                } else {
                    if (currentFilterItems[filter.filterName].endSelectedValue && startSelectedValue != "Выбрать") {
                        delete currentFilterItems[filter.filterName].endSelectedValue;
                    }
                }
                if (endSelectedValue == "Выбрать" && startSelectedValue == "Выбрать") {
                    delete currentFilterItems[filter.filterName];
                }

            }
            productItems.forEach(function (item) {
                var matches = true;
                var containAll = true;

                for (var keyFilter in currentFilterItems) {
                    var contain = false;
                    if (keyFilter == 'Цена') {
                        contain = true;
                        if (
                            (!isNaN(currentFilterItems[keyFilter].startNumberValue) && isNaN(currentFilterItems[keyFilter].endNumberValue) && (currentFilterItems[keyFilter].startNumberValue > item.price)) ||
                            (!isNaN(currentFilterItems[keyFilter].endNumberValue) && isNaN(currentFilterItems[keyFilter].startNumberValue) && (currentFilterItems[keyFilter].endNumberValue < item.price)) ||
                            (!isNaN(currentFilterItems[keyFilter].startNumberValue) && !isNaN(currentFilterItems[keyFilter].endNumberValue) && !(!(currentFilterItems[keyFilter].startNumberValue > item.price) && !(currentFilterItems[keyFilter].endNumberValue < item.price)))
                        ) {
                            matches = false;
                        }
                    }
                    item.properties.forEach(function (filterItem) {
                        if (filterItem.propertyName == keyFilter) {
                            contain = true;
                        }
                        if ((filterItem.propertyType == 'simpletext') && (filterItem.propertyName == keyFilter) && (filterItem.propertyValue != currentFilterItems[keyFilter])) {
                            matches = false;
                        }
                        if ((filterItem.propertyType == 'numberBoolean') && (filterItem.propertyName == keyFilter)) {
                            var checked = filterItem.propertyValue.split(",")[0];
                            var count = filterItem.propertyValue.split(",")[1];
                            if (!(currentFilterItems[keyFilter].state && checked == 'true') || (currentFilterItems[keyFilter].count && (currentFilterItems[keyFilter].count != count)))
                                matches = false;
                        }
                        if ((filterItem.propertyType == 'enum') && (filterItem.propertyName == keyFilter) && (filterItem.propertyValue.split(",").indexOf(currentFilterItems[keyFilter]) == -1 )) {
                            matches = false;
                        }
                        if ((keyFilter != 'Цена' && (filterItem.propertyType == 'number' || filterItem.propertyType == 'float')) && (filterItem.propertyName == keyFilter)
                            && (
                            (!isNaN(currentFilterItems[keyFilter].startNumberValue) && isNaN(currentFilterItems[keyFilter].endNumberValue) && (currentFilterItems[keyFilter].startNumberValue > filterItem.propertyValue)) ||
                            (!isNaN(currentFilterItems[keyFilter].endNumberValue) && isNaN(currentFilterItems[keyFilter].startNumberValue) && (currentFilterItems[keyFilter].endNumberValue < filterItem.propertyValue)) ||
                            (!isNaN(currentFilterItems[keyFilter].startNumberValue) && !isNaN(currentFilterItems[keyFilter].endNumberValue) && !(!(currentFilterItems[keyFilter].startNumberValue > filterItem.propertyValue) && !(currentFilterItems[keyFilter].endNumberValue < filterItem.propertyValue))))
                        ) {
                            matches = false;
                        }
                        if ((filter.filterType == "size" || filter.filterType == "interval" || filter.filterType == "interval" || filter.filterType == "attitude")
                            && (filterItem.propertyName == keyFilter)
                            && (
                            (currentFilterItems[keyFilter].startSelectedValue && !currentFilterItems[keyFilter].endSelectedValue && (parseFloat(currentFilterItems[keyFilter].startSelectedValue) > parseFloat(filterItem.propertyValue.split(",")[0]))) ||
                            (currentFilterItems[keyFilter].endSelectedValue && !currentFilterItems[keyFilter].startSelectedValue && (parseFloat(currentFilterItems[keyFilter].endSelectedValue) < parseFloat(filterItem.propertyValue.split(",")[1]))) ||
                            (currentFilterItems[keyFilter].startSelectedValue && currentFilterItems[keyFilter].endSelectedValue && !(!(parseFloat(currentFilterItems[keyFilter].startSelectedValue) > parseFloat(filterItem.propertyValue.split(",")[0])) && !(parseFloat(currentFilterItems[keyFilter].endSelectedValue) < parseFloat(filterItem.propertyValue.split(",")[1])))))) {
                            matches = false;
                        }

                    });
                    if (!contain) {
                        containAll = false;
                    }

                }
                if (matches && containAll) {
                    filteriedData.push(item);
                }
            });

            drawProductList();
        };

    }

    return PORTAL;

})(PORTAL || {}, jQuery);