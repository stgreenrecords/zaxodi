/*
 * Copyright 1997-2008 Day Management AG
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
 * @class CQ.form.SizeField
 * @extends CQ.form.CompositeField
 * The SizeField lets the user enter the width and height (for example for
 * an image).
 * @constructor
 * Creates a new SizeField.
 * @param {Object} config The config object
 */
CQ.form.CatalogSizeField = CQ.Ext.extend(CQ.form.CompositeField, {

    /**
     * @cfg {String} widthParameter
     * The name of the width parameter. Defaults to './width'.
     */
    widthParameter: null,

    /**
     * @cfg {String} widthPrefix
     * The string to add before the width field.
     */
    widthPrefix: null,

    /**
     * @cfg {String} widthSuffix
     * The string to add after the width field.
     */
    widthSuffix: null,

    /**
     * @cfg {String} heightParameter
     * The name of the height parameter. Defaults to './height'.
     */
    heightParameter: null,

    /**
     * @cfg {String} heightPrefix
     * The string to add before the height field. Defaults to '&times;'.
     */
    heightPrefix: null,

    /**
     * @cfg {String} heightSuffix
     * The string to add after the height field. Defaults to 'px'.
     */
    heightSuffix: null,

    /**
     * @cfg {Number} fieldWidth
     * The width of the fields in pixels. Defaults to 40.
     */
    fieldWidth: 0,

    /**
     * @private
     * @type CQ.Ext.form.TextField
     */
    widthField: null,

    /**
     * @private
     * @type CQ.Ext.form.TextField
     */
    heightField: null,

    widthPrefixStyle: null,
    widthInputClass: null,
    heightPrefixStyle: null,
    heightInputClass: null,

    constructor: function (config) {
        config = config || {};
        var defaults = {
            "widthParameter": "./width",
            "heightParameter": "./height",
            "fieldWidth": "100",
            "border": false,
            "layout": "column",
            "widthSuffixStyle": "padding-top: 3px; padding-left: 4px;",
            "widthInputClass": "cq-sif-widthinput",
            "heightPrefix": "&times;",
            "heightPrefixStyle": "padding-top: 3px; padding-left: 15px; padding-right: 15px;",
            "heightSuffixStyle": "padding-top: 3px; padding-left: 4px;",
            "heightInputClass": "cq-sif-heightinput",
            "fieldConfig": {},
            "stateful": false
        };
        config = CQ.Util.applyDefaults(config, defaults);
        CQ.form.CatalogBooleanNumberField.superclass.constructor.call(this, config);
    },

    // overriding CQ.Ext.Component#initComponent
    initComponent: function () {
        CQ.form.CatalogSizeField.superclass.initComponent.call(this);
        var fieldDef;
        if (this.widthPrefix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.widthPrefix),
                "border": false,
                "style": (this.widthPrefixStyle ? this.widthPrefixStyle : null)
            }));
        }
        fieldDef = {
            "name": this.widthParameter,
            "width": this.fieldWidth,
            "cls": (this.widthInputClass ? this.widthInputClass : ""),
            "stateful": false
        };
        CQ.Ext.apply(fieldDef, this.fieldConfig);
        this.widthField = new CQ.Ext.form.TextField(fieldDef);
        this.add(this.widthField);
        if (this.widthSuffix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.widthSuffix),
                "border": false,
                "style": (this.widthSuffixStyle ? this.widthSuffixStyle : null)
            }));
        }
        if (this.heightPrefix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.heightPrefix),
                "border": false,
                "style": (this.heightPrefixStyle ? this.heightPrefixStyle : null)
            }));
        }
        fieldDef = {
            "name": this.heightParameter,
            "width": this.fieldWidth,
            "cls": (this.heightInputClass ? this.heightInputClass : ""),
            "stateful": false
        };
        CQ.Ext.apply(fieldDef, this.fieldConfig);
        this.heightField = new CQ.Ext.form.TextField(fieldDef);
        this.add(this.heightField);
        if (this.heightSuffix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.heightSuffix),
                "border": false,
                "style": (this.heightSuffixStyle ? this.heightSuffixStyle : null)
            }));
        }
    },

    // overriding CQ.form.CompositeField#processRecord
    processRecord: function (record, path) {
        if (this.fireEvent('beforeloadcontent', this, record, path) !== false) {
            var defaultWidth = null;
            var defaultHeight = null;
            if (this.defaultValue) {
                var splitDefaultValue = this.defaultValue.split(",");
                if (splitDefaultValue.length == 2) {
                    try {
                        defaultWidth = splitDefaultValue[0];
                        defaultHeight = splitDefaultValue[1];
                    } catch (e) {
                        // ignore
                    }
                }
            }
            var width = record.get(this.widthParameter);
            if (width == undefined && defaultWidth != null) {
                if (this.isApplyDefault(record, path)) {
                    this.widthField.setValue(defaultWidth);
                }
            } else {
                this.widthField.setValue(width);
            }
            var height = record.get(this.heightParameter);
            if (height == undefined && defaultHeight != null) {
                if (this.isApplyDefault(record, path)) {
                    this.heightField.setValue(defaultHeight);
                }
            } else {
                this.heightField.setValue(height);
            }

            this.fireEvent('loadcontent', this, record, path);
        }
    },

    // overriding CQ.form.CompositeField#setValue
    setValue: function (value) {
        var width = null;
        var height = null;
        if (value) {
            var splitValue = value.split(",");
            if (splitValue.length == 2) {
                try {
                    width = splitValue[0];
                    height = splitValue[1];
                } catch (e) {
                    // ignore
                }
            }
        }
        this.widthField.setValue(width);
        this.heightField.setValue(height);
    },

    // overriding CQ.form.CompositeField#getValue
    getValue: function () {
        return this.getRawValue();
    },

    // overriding CQ.form.CompositeField#getRawValue
    getRawValue: function () {
        var width = this.widthField.getValue() || "";
        var height = this.heightField.getValue() || "";
        if ((width.length == 0) && (height.length == 0)) {
            return "";
        }
        return width + "," + height;
    },

    // Validation --------------------------------------------------------------------------

    // overriding CQ.form.CompositeField#markInvalid
    markInvalid: function (msg) {
        this.widthField.markInvalid(msg);
        this.heightField.markInvalid(msg);
    },

    // overriding CQ.form.CompositeField#markInvalid
    clearInvalid: function () {
        this.widthField.clearInvalid();
        this.heightField.clearInvalid();
    }

});

// register xtype
CQ.Ext.reg('catalogsizefield', CQ.form.CatalogSizeField);