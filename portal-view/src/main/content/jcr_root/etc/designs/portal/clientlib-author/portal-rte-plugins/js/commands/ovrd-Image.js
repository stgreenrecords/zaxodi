CQ.Ext.override(CUI.rte.commands.Image,{
    createImage: function(execDef) {
        var value = execDef.value;
        var url = null;
        if (value.path) {
                url = value.path;
        }

        if(value && value.isSlider) {


			if(value.pathslider){
				var arraySlider = value.pathslider.split(',');
				
                var imgHtml = '<div title="Double Click for delete presentation" class="presentationSlide">' +
								'<a class="arrow left" rel="nofollow"> </a>' +
								'<div class="stage" ondblclick="var parent = this.parentNode.parentNode;parent.removeChild(this.parentNode);" >' +
								'<div class="slide_container">';

                var slideHtml = "";
                for(var i = 0; i < arraySlider.length; i++){
                    slideHtml += '<div class="slide" data-index="' + (i+1) + '">' + 
									'<img class="slide_image" src="' + arraySlider[i] + '" ' + CUI.rte.Common.SRC_ATTRIB + '="' + arraySlider[i] + '"/>' + 
								  '</div>';
                }

				imgHtml += slideHtml;

                imgHtml += '<p></div></div><a rel="nofollow" class="arrow right"> </a>' +
                    '<div class="toolbar"><div class="nav"><a class="btnFirst" rel="nofollow" title="First Slide"> </a><a class="btnPrevious" rel="nofollow" title="Previous Slide"> </a>' +
                    '<a class="btnNext" rel="nofollow" title="Next Slide"> </a><a class="btnLast" rel="nofollow" title="Last Slide"> </a></div><div class="navActions">' + 
                    '<a class="btnFullScreen" rel="nofollow" title="View Fullscreen"> </a><a class="btnLeaveFullScreen" rel="nofollow" title="Exit Fullscreen">1111 </a><label class="goToSlideLabel">' +
                    '<input type="text" value="0"/><span>/</span></label></div></div></div><p>&nbsp;</p><p>&nbsp;</p>';

                execDef.component.execCmd("inserthtml", imgHtml);
            }


        }
        else if(value && (value.isVideo || value.isAudio )){
            if(value.pathframe && value.isVideo){
				/*CQ.Ext.MessageBox.confirm('Question', 'Make video downloadable?', function(btn) {*/
                    var imgHtml = "<iframe \" class=\"videoPort\" width=\"646\" height=\"365\" src=\""+value.pathframe+"&w=646&h=365\" frameborder=\"0\" allowfullscreen=\"\"></iframe><br>";
                    /*if (btn=="yes"){
						var onclick = "onclick='(function qwe(){document.location=\"data:Application/octet-stream," + value.pathframe.replace('player/?v=', 'v/') + "\";})();'";
                        var dButtonHtml = "<button " + onclick + " class='videoPlayerDownload'> Download video </button>";
                        imgHtml += dButtonHtml;
                    }*/
                    execDef.component.execCmd("inserthtml", imgHtml);
                //});
            }else if(value.pathframe && value.isAudio){
                var imgHtml = "<iframe class=\"videoPort\" height=\"30\" src=\""+value.pathframe+"\" frameborder=\"0\" allowfullscreen=\"\"></iframe><br>";
                execDef.component.execCmd("inserthtml", imgHtml);
            }
        } else {
            var alt = (value.alt ? value.alt : "");
            var width = (value.width ? value.width : null);
            var height = (value.height ? value.height : null);
            var maxwidth = (value.maxwidth ? value.maxwidth : null);
            // todo encoding(?)
            if (url) {
                var imgHtml = "<img src=\"" + url + "\" alt=\"" + alt + "\"";
                imgHtml += " " + CUI.rte.Common.SRC_ATTRIB + "=\"" + url + "\"";
                if (width) {
                    imgHtml += " width=\"" + width + "\"";
                }
                if (height) {
                    imgHtml += " height=\"" + height + "\"";
                }
                if (maxwidth) {
                    imgHtml += " style=\"max-width:" + maxwidth + "\"";
                }
                imgHtml += ' ';
                imgHtml += ">";

				var imageNode = $(imgHtml);

				var resultWidth = 640;
				var selection = CUI.rte.Selection.createProcessingSelection(execDef.editContext);
                var parentNode = selection.startNode.parentNode;
                if (parentNode.tagName === "TD" || parentNode.parentNode.tagName === "TD"){
                    if (parentNode.tagName === "TD"){
                        resultWidth = Math.floor(resultWidth/parentNode.parentNode.cells.length);
                    } else {
                        resultWidth = Math.floor(resultWidth/parentNode.parentNode.parentNode.cells.length);
                    }
                }
                var resultHeight;
                imageNode.one("load", function() {
                    if (imageNode[0].width > resultWidth) {
                        var width = imageNode[0].width;
                        var height = imageNode[0].height;
						var coeff = width/resultWidth;
                        var resultHeight = Math.floor(height/coeff);

                        imageNode.attr("src", url + ".rend." + resultWidth + "x" + resultHeight + ".img");
                        imageNode.attr(CUI.rte.Common.SRC_ATTRIB, url + ".rend." + resultWidth + "x" + resultHeight + ".img");
                    }
                    execDef.component.execCmd("inserthtml", imageNode[0].outerHTML);
                });
            }
        }
    },
    applyProperties: function(execDef) {
        var props = execDef.value;
        var com = CUI.rte.Common;
        var selection = execDef.selection;
        if (selection.startNode && (selection.startOffset == undefined)
                && !selection.endNode) {
            var node = selection.startNode;
            if (!com.isTag(node, "img")) {
                return;
            }
            var stylePrefix = "style.";
            for (var propName in props) {
                if (props.hasOwnProperty(propName)) {
                    if (com.strStartsWith(propName, stylePrefix)) {
                        var styleName =
                                propName.substring(stylePrefix.length, propName.length);
                        if (styleName == "float") {
                            if (CQ.Ext.isIE) {
                                styleName = "styleFloat";
                            } else {
                                styleName = "cssFloat";
                            }
                            node.style[styleName] = props[propName];
                        } else if (com.strStartsWith(styleName,"margin")) {
                            node.style[styleName] = props[propName];
                        }
                    } else {
                        node.setAttribute(propName, props[propName]);
                    }
                }
            }
            if (CQ.Ext.isGecko) {
                CUI.rte.Selection.flushSelection(execDef.editContext);
            }
        }
    }   

});