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
CQ.form.rte.plugins.VideoPlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @private
     */
    linkUI: null,
     
    /**
     * @private
     */
    videoDialog: null,

    constructor: function(editorKernel) {
        CQ.form.rte.plugins.VideoPlugin.superclass.constructor.call(this, editorKernel);
        this.videoDialog = CQ.Ext.ComponentMgr.create({xtype: "rtevideodialog", "editorKernel": editorKernel});
    },

    getFeatures: function() {
        return [ "video" ];
    },

    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins;
        var ui = CQ.form.rte.ui;
        if (this.isFeatureEnabled("video")) {
            this.linkUI = new ui.TbElement("addvideo", this, false,
                  {"title": "Video", "text": "Inserts video from specified URL."},"videoIcon");
            tbGenerator.addElement("video", plg.Plugin.SORT_LINKS, this.linkUI, 10);
        }
    },

    execute: function(pluginCommand, value, envOptions) {
        this.videoDialog.show();
        this.videoDialog.toFront();
        window.setTimeout(function() {
            this.videoDialog.toFront();
        }.createDelegate(this), 10);
    }

});


// register plugin
CQ.form.rte.plugins.PluginRegistry.register("video", CQ.form.rte.plugins.VideoPlugin);