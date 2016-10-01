CQ.form.rte.plugins.QuotePlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @private
     */
    linkUI: null,

    that: null,
    kernel: null,


    constructor: function(editorKernel) {
        CQ.form.rte.plugins.QuotePlugin.superclass.constructor.call(this, editorKernel);
        that = this;
        kernel = this.editorKernel;
        if (!CQ.form.rte.plugins.QuotePlugin.askForm){
            CQ.form.rte.plugins.QuotePlugin.askForm = new CQ.Dialog(that.config);
        }
    },

    getFeatures: function() {
        return ["quote"];
    },

    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins; 
        var ui = CQ.form.rte.ui;

        if (this.isFeatureEnabled("quote")) {
            this.linkUI = new ui.TbElement("quote", this, false,
                    {"title": "Quote", "text": "Create quote"}, "cq-cft-tab-icon manuscripts");
            tbGenerator.addElement("quote", plg.Plugin.SORT_LINKS, this.linkUI, 10);
        }
    }, 

    execute: function(pluginCommand, value, envOptions) {
		this.askParameters();
    },

    askParameters: function(){
        var form = CQ.form.rte.plugins.QuotePlugin.askForm;
        form.find("id","sign")[0].reset();
        form.find("id","text")[0].reset();
        setTimeout(function(){form.show();},0);
    },

    config:{
        	xtype:"dialog",
            title:"Quote",
            width:550,
        	height:200,
            closable:false,
            modal:true,
            resizable:false,
            buttons:[{
            			id:"okBtn",
                		text:"Ok",
                		handler:function(){
                		var sign = CQ.form.rte.plugins.QuotePlugin.askForm.find("id","sign")[0].getValue();
                    	var text = CQ.form.rte.plugins.QuotePlugin.askForm.find("id","text")[0].getValue();
                    	kernel.relayCmd("quote",{text:text,sign:sign});
                    	CQ.form.rte.plugins.QuotePlugin.askForm.hide();
                		}
                	},{
                       	id:"cancelBtn",
                        text:"Cancel",
                        handler: function(){CQ.form.rte.plugins.QuotePlugin.askForm.hide();}
                    }],
            items:[{
            		xtype:"panel",
                	layout: "form",
                	items:[{
                        id: "sign",
                        xtype:"textfield",
                        fieldLabel:"Signature",
                        width:390
                    },{
                        id:"text",
                        xtype:"textarea",
                        fieldLabel:"Text",
                        width:390
                    }]
            	}]
}

    /*new CQ.Ext.Window()*/
});

// register plugin
CQ.form.rte.plugins.PluginRegistry.register("quote", CQ.form.rte.plugins.QuotePlugin);