/*
 * Copyright 1997-2009 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */

/**
 * @class CQ.form.rte.plugins.StylesPlugin
 * @extends CQ.form.rte.plugins.Plugin
 * <p>This class implements styling text fragments with a CSS class (using "span" tags) as a
 * plugin.</p>
 * <p>The plugin ID is "<b>styles</b>".</p>
 * <p><b>Features</b></p>
 * <ul>
 *   <li><b>styles</b> - adds a style selector (styles will be applied on selection scope)
 *     </li>
 * </ul>
 * <p><b>Additional config requirements</b></p>
 * <p>The following plugin-specific settings must be configured through the corresponding
 * {@link CQ.form.rte.EditorKernel} instance:</p>
 * <ul>
 *   <li>The stylesheets to be used must be provided through
 *     {@link CQ.form.RichText#externalStyleSheets}.</li>
 * </ul>
 */
CQ.form.rte.plugins.FontSizePlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @cfg {Object/Object[]} styles
     * <p>Defines CSS classes that are available to the user for formatting text fragments
     * (defaults to { }). There are two ways of specifying the CSS classes:</p>
     * <ol>
     *   <li>Providing styles as an Object: Use the CSS class name as property name.
     *   Specify the text that should appear in the style selector as property value
     *   (String).</li>
     *   <li>Providing styles as an Object[]: Each element has to provide "cssName" (the
     *   CSS class name) and "text" (the text that appears in the style selector)
     *   properties.</li>
     * </ol>
     * <p>Styling is applied by adding "span" elements with corresponding "class"
     * attributes appropriately.</p>
     * @since 5.3
     */

    /**
     * @private
     */
    cachedStyles: null,

    /**
     * @private
     */
    stylesUI: null,

    constructor: function(editorKernel) {
        CQ.form.rte.plugins.FontSizePlugin.superclass.constructor.call(this, editorKernel);
    },

    getFeatures: function() {
        return [ "styles" ];
    },

    reportStyles: function() {
        return [ {
                "type": "text",
                "styles": this.getStyles()
            }
        ];
    },

    getStyles: function() {
        var com = CQ.form.rte.Common;
        if (!this.cachedStyles) {
            this.cachedStyles = this.config.styles || { };
            com.removeJcrData(this.cachedStyles);
            this.cachedStyles = com.toArray(this.cachedStyles, "cssName", "text");
        }
        return this.cachedStyles;
    },
 
    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins;
        var ui = CQ.form.rte.ui;
        if (this.isFeatureEnabled("styles")) {
            this.stylesUI = new ui.TbFontSizeSelector("fontsize", this, null, this.getStyles());
            tbGenerator.addElement("fontsize", plg.Plugin.SORT_STYLES, this.stylesUI, 10);
        }
    },

    notifyPluginConfig: function(pluginConfig) {
        pluginConfig = pluginConfig || { };
        CQ.Util.applyDefaults(pluginConfig, {
            "styles": {
                // empty default value
            }
        });
        this.config = pluginConfig;
    },

    execute: function(cmdId) {
    	
        if (!this.stylesUI) {
            return;
        }
        var cmd = null;
        var value = null;
        switch (cmdId.toLowerCase()) {
            case "fontsize":
                cmd = "applyfontsize";
                value = this.stylesUI.getSelectedStyle();
                break;
            case "fontsize_remove":
                cmd = "removefontsize";
                value = {
                    "styles": this.getStyles()
                };
                break;
        }
        
        if (cmd) {
            this.editorKernel.relayCmd(cmd, value);
        }
    },

    updateState: function(selDef) {
    	
    	
    	
        if (!this.stylesUI || !this.stylesUI.getExtUI()) {
            return;
        }
        
        var com = CQ.form.rte.Common;
        var styles = [];
        var nodeList = selDef.nodeList;
        var context = selDef.editContext;
        if (nodeList) {
	        var texts = nodeList.getTags(context, [ {
	            "matcher": function(dom) {
	                    return (com.isTag(dom, "span") && !!dom.style.fontSize);
	            }
	        }
	        ], true, true);
	        CQ.form.rte.ListUtils.postprocessSelectedItems(texts);
	        var nodeCnt = texts.length;
	        if (nodeCnt>0){
		        for (var nodeIndex = 0; nodeIndex < nodeCnt; nodeIndex++) {
		            var nodeToProcess = texts[nodeIndex];
		            var dom = nodeToProcess.dom;
		            styles.push(dom.style.fontSize);
		        }
	        }
        }
        
        var actualStyles = [ ];
        var indexToSelect, s;
        var styleableObject = selDef.selectedDom;
       
        if (styleableObject) {
            if (!CQ.form.rte.Common.isTag(selDef.selectedDom,
                    CQ.form.rte.plugins.FontSizePlugin.STYLEABLE_OBJECTS)) {
                styleableObject = null;
            }
        }
        var selectorDom = this.stylesUI.getExtUI().dom;
        
        var stylesDef = this.getStyles();
        var styleCnt = stylesDef.length;
        
        if (styleableObject) {
            for (s = 0; s < styleCnt; s++) {
                var styleName = stylesDef[s].cssName;
                
                if (com.hasCSS(styleableObject, styleName)) {
                	
                    actualStyles.push({
                        "className": styleName
                    });
                }
            }
        } else {
            var checkCnt = styles.length;
            for (var c = 0; c < checkCnt; c++) {
                var styleToProcess = styles[c];
                for (s = 0; s < styleCnt; s++) {
                	if (styleToProcess==stylesDef[s].cssName) {
                        actualStyles.push(styleToProcess);
                        break;
                    }
                }
            }
        }
        if (actualStyles.length == 0) {
            indexToSelect = 0;
        } else if (actualStyles.length > 1) {
            indexToSelect = -1;
        } else {
            
                var styleToSelect = actualStyles[0];
                var options = selectorDom.options;
                
                for (var optIndex = 0; optIndex < options.length; optIndex++) {
                	var optionToCheck = options[optIndex];
                    if (optionToCheck.value!='none'){
	                    if (optionToCheck.value == styleToSelect) {
	                        indexToSelect = optIndex;
	                        break;
	                    }
	                }
                 }
            
        }
        selectorDom.selectedIndex = indexToSelect;
        if (styleableObject != null) {
      //      selectorDom.disabled = false;
       //     removeBtn.setDisabled(indexToSelect == 0);
        } else if (selDef.isSelection) {
        //    selectorDom.disabled = !((indexToSelect == 0) && this.getStyles());
        //    removeBtn.disable(true);
        } else {
      //      removeBtn.setDisabled(indexToSelect == 0);
          //  selectorDom.disabled = true;
        }
    }

});

/**
 * Array with tag names that define objects (like images) that are styleable when selected
 * @private
 * @static
 * @final
 * @type String[]
 */
CQ.form.rte.plugins.FontSizePlugin.STYLEABLE_OBJECTS = [
    "img"
];


// register plugin
CQ.form.rte.plugins.PluginRegistry.register("fontsize", CQ.form.rte.plugins.FontSizePlugin);