CQ.form.rte.plugins.DAMPlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @private
     */
    linkUI: null,
     
    /**
     * @private
     */
    damDialog: null,

    constructor: function(editorKernel) {
        CQ.form.rte.plugins.DAMPlugin.superclass.constructor.call(this, editorKernel);
        this.damDialog = CQ.Ext.ComponentMgr.create({xtype: "rtedamdialog", "editorKernel": editorKernel});
    },

    getFeatures: function() {
        return [ "dam" ];
    },

    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins;
        var ui = CQ.form.rte.ui;
        if (this.isFeatureEnabled("dam")) {
            this.linkUI = new ui.TbElement("adddam", this, false,
                    {"title": "Image", "text": "Inserts image"});
            tbGenerator.addElement("dam", plg.Plugin.SORT_LINKS, this.linkUI, 10);
        }
    },

    execute: function(pluginCommand, value, envOptions) {
        this.damDialog.show();
        this.damDialog.toFront();
        window.setTimeout(function() {
            this.damDialog.toFront();
        }.createDelegate(this), 10);
    }

});


// register plugin
CQ.form.rte.plugins.PluginRegistry.register("dam", CQ.form.rte.plugins.DAMPlugin );