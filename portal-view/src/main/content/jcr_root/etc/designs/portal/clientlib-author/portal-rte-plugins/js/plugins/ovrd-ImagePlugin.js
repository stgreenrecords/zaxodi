/** @override CQ.form.rte.plugins.ImagePlugin by EPAm */

CQ.Ext.override(CUI.rte.plugins.ImagePlugin, {
    handleContextMenu: function(menuBuilder, selDef, context) {
	    var subItems;
	    var ui = CQ.form.rte.ui;
	    if (this.isFeatureEnabled("image")) {
	        if (this.editorKernel.queryState("image")) {
	            subItems = [
	                {
	                    "text": CQ.I18n.getMessage("Left"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "align": "left"
	                    } /*,
	                    "iconCls": "rte-cellmerge" */
	                },{
	                    "text": CQ.I18n.getMessage("Right"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "align": "right"
	                    } /*,
	                    "iconCls": "rte-cellmerge" */
	                },{
	                    "text": CQ.I18n.getMessage("None"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "align": "none"
	                    } /*,
	                    "iconCls": "rte-cellmerge" */
	                },{
	                    "text": CQ.I18n.getMessage("No alignment"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "align": ""
	                    } /*,
	                    "iconCls": "rte-cellmerge" */
	                },{
	                    "text": CQ.I18n.getMessage("Remove Top Margin"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "style.marginTop": "0em"
	                	}
	                },{
	                	"text": CQ.I18n.getMessage("Remove Right Margin"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "style.marginRight": "0em"
	                	}
	                },{
	                	"text": CQ.I18n.getMessage("Remove Bottom Margin"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "style.marginBottom": "0em"
	                	}
	                },{
	                	"text": CQ.I18n.getMessage("Remove Left Margin"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "style.marginLeft": "0em"
	                	}
	                },{
	                	"text": CQ.I18n.getMessage("Remove All Margins"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "style.margin": "0em"
	                	}
	                },{
	                	"text": CQ.I18n.getMessage("Margin Everywhere"),
	                    "plugin": this,
	                    "cmd": "image",
	                    "cmdValue": {
	                        "style.margin": "1em"
	                	}
	                }
                ];
	            menuBuilder.addItem(new ui.CmItem({
	                "text": CQ.I18n.getMessage("Image alignment"),
	                "subItems": subItems /*,
	                "iconCls": "rte-cell" */
	            }));
	        }
	    }
	}
	
});