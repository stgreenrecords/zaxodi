
/**
 * @class CQ.form.rte.plugins.SubSuperScriptPlugin
 * @extends CQ.form.rte.plugins.Plugin
 * <p>This class implements sub- and superscript as a plugin.</p>
 * <p>The plugin ID is "<b>subsuperscript</b>".</p>
 * <p><b>Features</b></p>
 * <ul>
 *   <li><b>subscript</b> - adds a button to format the selected text with subscript</li>
 *   <li><b>superscript</b> - adds a button to format the selected text with superscript
 *     </li>
 * </ul>
 */
CQ.form.rte.plugins.CleanHtmlPlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @private
     */
    cleanupUI: null,

    constructor: function(editorKernel) {
        CQ.form.rte.plugins.CleanHtmlPlugin.superclass.constructor.call(this,
                editorKernel);
    },

    getFeatures: function() {
        return [ "cleanup" ];
    },

    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins;
        var ui = CQ.form.rte.ui;
        if (this.isFeatureEnabled("cleanup")) {
            this.cleanupUI = new ui.TbElement("cleanup", this, true,
                    this.getTooltip("cleanup"));
            tbGenerator.addElement("cleanup", plg.Plugin.SORT_FORMAT, this.cleanupUI, 150);
        }
        
    },

    execute: function(id) {
        this.editorKernel.relayCmd("cleanhtml");
    },

    updateState: function(selDef) {
//        var hasSubscript = this.editorKernel.queryState("subscript", selDef);
//        var hasSuperscript = this.editorKernel.queryState("superscript", selDef);
//        if (this.subscriptUI != null) {
//            this.subscriptUI.getExtUI().setDisabled(!selDef.isSelection);
//            this.subscriptUI.getExtUI().toggle(hasSubscript);
//        }
//        if (this.superscriptUI != null) {
//            this.superscriptUI.getExtUI().setDisabled(!selDef.isSelection);
//            this.superscriptUI.getExtUI().toggle(hasSuperscript);
//        }
    },

    notifyPluginConfig: function(pluginConfig) {
        // configuring "special characters" dialog
        pluginConfig = pluginConfig || { };
        var defaults = {
            "tooltips": {
                "cleanup": {
                    "title": "Clean Up",
                    "text": "Plain text"
                }
            }
        };
        CQ.Util.applyDefaults(pluginConfig, defaults);
        this.config = pluginConfig;
    }

});


// register plugin
CQ.form.rte.plugins.PluginRegistry.register("cleanhtml",
        CQ.form.rte.plugins.CleanHtmlPlugin);