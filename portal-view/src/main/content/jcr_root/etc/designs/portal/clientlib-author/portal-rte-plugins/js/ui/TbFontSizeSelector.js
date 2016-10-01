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
 * @class CQ.form.rte.ui.TbStyleSelector
 * @extends CQ.form.rte.ui.TbElement
 * @private
 * This class represents a style selecting element for use in
 * {@link CQ.form.rte.ui.ToolbarBuilder}.
 */
CQ.form.rte.ui.TbFontSizeSelector = CQ.Ext.extend(CQ.form.rte.ui.TbElement, {

    styleSelector: null,

    styles: null,

    toolbar: null,
 
    constructor: function(id, plugin, tooltip, styles) {
        CQ.form.rte.ui.TbFontSizeSelector.superclass.constructor.call(this, id, plugin, false,
                tooltip);
        this.styles = styles;
    },

    /**
     * Creates HTML code for rendering the options of the style selector.
     * @return {String} HTML code containing the options of the style selector
     * @private
     */
    createStyleOptions: function() {
        var htmlCode = "<option value=\"none\">[None]</option>";
        if (this.styles) {
            var styleCnt = this.styles.length;
            for (var s = 0; s < styleCnt; s++) {
                var styleToAdd = this.styles[s];
                var className = styleToAdd.cssName;
                var text = styleToAdd.text;
                htmlCode += "<option value=\"" + className + "\" class=\"" + className
                    + "\">" + text + "</option>";
            }
        }
        return htmlCode;
    },

    getToolbar: function() {
        return CQ.form.rte.ui.ToolbarBuilder.STYLE_TOOLBAR;
    },

    addToToolbar: function(toolbar) {
        this.toolbar = toolbar;
        if (CQ.Ext.isIE) {
            // the regular way doesn't work for IE anymore with Ext 3.1.1, hence working
            // around
            var helperDom = document.createElement("span");
            helperDom.innerHTML = "<select class=\"x-font-select\">"
                    + this.createStyleOptions() + "</span>";
            this.styleSelector = CQ.Ext.get(helperDom.childNodes[0]);
        } else {
            this.styleSelector = CQ.Ext.get(CQ.Ext.DomHelper.createDom({
                tag: "select",
                cls: "x-font-select",
                html: this.createStyleOptions()
            }));
        }
        this.styleSelector.on('change', function() {
            var style = this.styleSelector.dom.value;
            if (style.length > 0) {
                this.plugin.execute(this.id);
            }
        }, this);
        this.styleSelector.on('focus', function() {
            this.plugin.editorKernel.isTemporaryBlur = true;
        }, this);
        // fix for a Firefox problem that adjusts the combobox' height to the height
        // of the largest entry
        this.styleSelector.setHeight(19);
        toolbar.add(
            "Font Size",
            " ",
            this.styleSelector.dom
        );
    },

    createToolbarDef: function() {
        // todo support usage in global toolbar
        return null;
    },

    getSelectedStyle: function() {
        var style = this.styleSelector.dom.value;
        if (style.length > 0) {
            return style;
        }
        return null;
    },

    getExtUI: function() {
        return this.styleSelector;
    }
});