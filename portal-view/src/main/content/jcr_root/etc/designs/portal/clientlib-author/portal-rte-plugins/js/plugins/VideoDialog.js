CQ.form.rte.plugins.VideoDialog = CQ.Ext.extend(CQ.Dialog, {
    /**
     * @private
     */
    tabPanel: null,
    /**
     * @private
     */
    panel: null,
    /**
     * @private
     */
    directLinkInput: null,
    /**
     * @private
     */
    defaultConfig: null,
    /**
     * @private
     */
    resetValues: function() {
        this.directLinkInput.reset();
    },
    /**
     * @private
     */
    init: function() {
        var dialog = this;

        this.directLinkInput = new CQ.Ext.form.TextField({
            fieldLabel: "Paste direct link to the video.",
            width: 360
        });

        var panelItems = [this.directLinkInput];

        this.panel = new CQ.Ext.Panel({
            title: "Video path",
            layout: "form",
            bodyStyle: "padding:15px",
            items: panelItems
        });

        this.tabPanel = new CQ.Ext.TabPanel({
            activeTab: 0,
            items: this.panel
        });

        this.defaultConfig = {
            resizable: false,
            modal: true,
            buttons: [{text: "OK", handler: function(b, e) {
                INFO.videoService.videoUrl = dialog.directLinkInput.getValue();
                if (INFO.videoService.validateUrl()) {
                    dialog.defaultConfig.editorKernel.relayCmd("video", INFO.videoService.getVideoFrame());
                    dialog.hide();
                } else {
                    var MESSAGE_ALERT_TITLE = "Validation failed";
                    var MESSAGE_ALERT_MESSAGE = "Verify the values of the marked fields";
                    dialog.directLinkInput.markInvalid(INFO.videoService.errMessage);
                    CQ.Ext.MessageBox.alert(MESSAGE_ALERT_TITLE, MESSAGE_ALERT_MESSAGE);
                }
            }}, CQ.Dialog.CANCEL],
            title: "Choose path",
            height: 300,
            items: this.tabPanel
        };
    },

    constructor: function(config) {
        this.init();
        this.defaultConfig = CQ.Util.applyDefaults(config, this.defaultConfig);
        CQ.form.rte.plugins.VideoDialog.superclass.constructor.call(this, this.defaultConfig);

        this.mon(this, "beforeshow", function(dialog) {
            dialog.resetValues();
        });
    }

});

// register VideoDialog component as xtype
CQ.Ext.reg("rtevideodialog", CQ.form.rte.plugins.VideoDialog);

//*****************************  C O M M A N D  ********************************
CQ.form.rte.commands.Video = CQ.Ext.extend(CQ.form.rte.commands.Command, {

    isCommand: function(cmdStr) {
        return (cmdStr.toLowerCase() == "video");
    },

    execute: function(execDef) {
        execDef.component.execCmd("inserthtml", execDef.value);
    }

});

// register command
CQ.form.rte.commands.CommandRegistry.register("video", CQ.form.rte.commands.Video);