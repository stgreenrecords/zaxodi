var PORTAL = (function (PORTAL, $) {

    PORTAL.modules.ProductList = {};

    PORTAL.modules.ProductList.selfSelector = ".product-list-block";

    PORTAL.modules.ProductList.init = function ($self) {

        console.log('Component: "ProductList"');

        var $filterPrice = $self.find("div#filterPrice").change(function () {
            applyFilter({
                type: "number",
                name: "price"
            }, $(this));
        });

        var $itemProductList = $self.find("div.itemProductList");
        var $sortPropertiesFilter = $self.find("div.sortPropertiesFilter");
        var $sortFilterGroupWrapper = $("<div class='filter-group'><div class='filter-array-storage'></div></div>");

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
                filteriedData = productItems;
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
                filterProperties.forEach(function (groupItem) {
                    var $sortFilterGroupWrapperClone = $sortFilterGroupWrapper.clone();
                    for (var filters in groupItem) {
                        var filter = filters;
                        var $groupHeader = $("<h3 class='filter-group-header-name'>" + "⇕ " + filter + "</h3>");
                        if (filter){
                            $sortPropertiesFilter.append($groupHeader);
                        }
                        var $filterArrayStorage;
                        groupItem[filters].forEach(function (filterItem) {
                            if (filterItem.name != "Price") {
                                var valueArray = filterItem.values || [];
                                var sortArrays = PORTAL.modules.ProductList.splitOnTwoArrayAndSort(valueArray);
                                var fieldFromStorage = PORTAL.catalogStorage.properties[filterItem.type].
                                filterDraw(filterItem, valueArray, sortArrays);
                                $filterArrayStorage = $sortFilterGroupWrapperClone.find(".filter-array-storage").append(fieldFromStorage);
                                if (filterItem.name == "Brand") {
                                    $sortPropertiesFilter.find(".filter-array-storage:first").append(fieldFromStorage);
                                } else {
                                    $sortPropertiesFilter.append($sortFilterGroupWrapperClone);
                                }
                                fieldFromStorage.change(function () {
                                    applyFilter(filterItem, fieldFromStorage);
                                });
                            }
                        });
                        $groupHeader.click(function () {
                            $filterArrayStorage.toggle("slow");
                        })
                    }
                });
            }
        };

        var applyFilter = function (filterItem, fieldFromStorage) {
            filteriedData = [];
            var storageForEachReturnedData = [];
            if (PORTAL.catalogStorage.properties[filterItem.type].isFilterEmpty(fieldFromStorage)) {
                delete currentFilterItems[filterItem.name];
            } else {
                currentFilterItems[filterItem.name] = fieldFromStorage;
            }
            var currentFilterStorageIsEmpty = true;
            for (var filter in currentFilterItems) {
                currentFilterStorageIsEmpty = false;
                var filterType = currentFilterItems[filter].attr('class').split(" ")[2];
                storageForEachReturnedData.push(PORTAL.catalogStorage.properties[filterType].doFilter(currentFilterItems[filter], productItems));
            }
            if (storageForEachReturnedData.length != 0) {
                storageForEachReturnedData[0].forEach(function (product) {
                    var allMatches = true;
                    for (var index = 1; index < storageForEachReturnedData.length; index++) {
                        if (!storageForEachReturnedData[index].includes(product)) {
                            allMatches = false;
                        }
                    }
                    if (allMatches) {
                        filteriedData.push(product);
                    }
                });
            }
            filteriedData = currentFilterStorageIsEmpty ? productItems : filteriedData;
            drawProductList();
        };

        var drawProductList = function () {
            currentPagePosition = 1;
            $itemProductList.find(".itemBlock").remove();
            $itemProductList.find("#paggination").remove();
            changeCountOfProducts(filteriedData.length);
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
            var $currentPage = $("<span class='currentPage'>Page " + currentPagePosition + " from " + countOfPage + "</span>");
            var $showAllPages = $("<input class='showAllPages' type='button' value='Show all' />").click(function () {
                $itemProductList.find(".itemBlock").remove();
                $itemProductList.find("#paggination").remove();
                filteriedData.forEach(function (item) {
                    drawItem(item);
                });
            });
            var $onFirstPage = $("<input class='onFirstPage' type='button' value='In the beginning' />").click(function () {
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

        };

        var drawItem = function (item) {
            var description = "<span class='description'>" + item.microdescription + "</span>";
            var priceMessage;
            if (item.Price) {
                priceMessage = item.Price + " BYN";
            } else {
                priceMessage = "Цена не указана.";
            }
            var $itemProduct = $(".template-product-item .itemBlock").clone();
            $itemProduct.find(".item-product-title a").attr("href", item.path + ".html").text(item.Brand + " " + item.Model);
            $itemProduct.find(".itemImage").attr("src", item.image);
            $itemProduct.find(".itemDiscription").append(description);
            $itemProduct.find(".itemPriceBlock").text(priceMessage);
            $itemProductList.append($itemProduct);
        };

        var changeCountOfProducts = function (count) {
            $countOfProducts.text("Total: " + count + " model(s)");
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
    };

    PORTAL.modules.ProductList.splitOnTwoArrayAndSort = function (filterValueArray) {
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

        return {
            'startParamArray': startParamArray.sort(compareNumbers),
            "endParamArray": endParamArray.sort(compareNumbers)
        };
    };

    return PORTAL;

})(PORTAL || {}, jQuery);