CQ.form.CatalogBooleanNumberField = CQ.Ext.extend(CQ.form.CompositeField, {

    booleanParameter: null,

    booleanPrefix: null,

    booleanSuffix: null,

    countParameter: null,

    countPrefix: null,

    countSuffix: null,

    fieldWidth: 0,

    booleanField: null,

    countField: null,

    widthPrefixStyle: null,
    widthInputClass: null,
    heightPrefixStyle: null,
    heightInputClass: null,

    constructor: function (config) {
        config = config || {};
        var defaults = {
            "booleanParameter": "./boolean",
            "countParameter": "./count",
            "fieldWidth": "100",
            "border": false,
            "layout": "column",
            "widthSuffixStyle": "padding-top: 3px; padding-left: 4px;",
            "widthInputClass": "cq-sif-widthinput",
            "countPrefix": "&times;",
            "heightPrefixStyle": "padding-top: 3px;",
            "heightSuffixStyle": "padding-top: 3px;",
            "heightInputClass": "cq-sif-heightinput",
            "fieldConfig": {},
            "stateful": false
        };
        config = CQ.Util.applyDefaults(config, defaults);
        CQ.form.CatalogSizeField.superclass.constructor.call(this, config);
    },

    // overriding CQ.Ext.Component#initComponent
    initComponent: function () {
        CQ.form.CatalogSizeField.superclass.initComponent.call(this);
        var fieldDef;
        if (this.booleanPrefix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.booleanPrefix),
                "border": false,
                "style": (this.widthPrefixStyle ? this.widthPrefixStyle : null)
            }));
        }
        fieldDef = {
            "name": this.booleanParameter,
            "width": this.fieldWidth,
            "cls": (this.widthInputClass ? this.widthInputClass : ""),
            "stateful": false,
            "type" : "checkbox",
            'paramToSearch': 'search',
            listeners: {
                selectionchanged: function (field, value, checked) {
                    var countField = this.ownerCt.items.items[3];
                    if (checked) {
                        countField.setValue("1");
                    } else {
                        countField.setValue("0");
                    }
                }
            }
        };

        CQ.Ext.apply(fieldDef, this.fieldConfig);
        this.booleanField = new CQ.form.Selection(fieldDef);
        this.add(this.booleanField);
        if (this.booleanSuffix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.booleanSuffix),
                "border": false,
                "style": (this.widthSuffixStyle ? this.widthSuffixStyle : null)
            }));
        }
        if (this.countPrefix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.countPrefix),
                "border": false,
                "style": (this.heightPrefixStyle ? this.heightPrefixStyle : null)
            }));
        }
        fieldDef = {

            "name": this.countParameter,
            "width": this.fieldWidth,
            "cls": (this.heightInputClass ? this.heightInputClass : ""),
            "stateful": false,
            'defaultValue': 0,
            listeners: {
                change : function (field, newValue, oldValue){
                  var checkbox = this.ownerCt.items.items[1];
                    if (newValue > 0){
						checkbox.setValue(["true"]);
                    } else {
						checkbox.setValue([]);
                    }
                }
            }
        };
        CQ.Ext.apply(fieldDef, this.fieldConfig);
        this.countField = new CQ.Ext.form.NumberField(fieldDef);
        this.add(this.countField);

        if (this.countSuffix) {
            this.add(new CQ.Ext.Panel({
                "html": CQ.I18n.getVarMessage(this.countSuffix),
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
            var width = record.get(this.booleanParameter);
            if (width == undefined && defaultWidth != null) {
                if (this.isApplyDefault(record, path)) {
                    this.booleanField.setValue(defaultWidth);
                }
            } else {
                if (width) {
                    this.booleanField.setValue(width);
                } else {
                    this.booleanField.setValue("off");
                }

            }
            var height = record.get(this.countParameter);
            if (height == undefined && defaultHeight != null) {
                if (this.isApplyDefault(record, path)) {
                    this.countField.setValue(defaultHeight);
                }
            } else {
                this.countField.setValue(height);
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
        this.booleanField.setValue(width);
        this.countField.setValue(height);
    },

    // overriding CQ.form.CompositeField#getValue
    getValue: function () {
        return this.getRawValue();
    },

    // overriding CQ.form.CompositeField#getRawValue
    getRawValue: function () {
        var width = this.booleanField.getValue() || "";
        var height = this.countField.getValue() || "";
        if ((width.length == 0) && (height.length == 0)) {
            return "";
        }
        return width + "," + height;
    },

    // Validation --------------------------------------------------------------------------

    // overriding CQ.form.CompositeField#markInvalid
    markInvalid: function (msg) {
        this.booleanField.markInvalid(msg);
        this.countField.markInvalid(msg);
    },

    // overriding CQ.form.CompositeField#markInvalid
    clearInvalid: function () {
        this.booleanField.clearInvalid();
        this.countField.clearInvalid();
    }


});

// register xtype
CQ.Ext.reg('catalogbooleannumberfield', CQ.form.CatalogBooleanNumberField);