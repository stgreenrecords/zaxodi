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
 * @class CQ.form.rte.commands.Style
 * @extends CQ.form.rte.commands.Command
 */
CQ.form.rte.commands.FontColor = CQ.Ext.extend(CQ.form.rte.commands.Command, {

    /**
     * Formats the currently selected text fragment with the given CSS style.
     * <p>
     * The currently selected text will be surrounded with a <code>span</code> tag that
     * has the given style name as its <code>class</code> attribute..
     * <p>
     * Note that this method only works on text fragments that have no other styles
     * applied.
     * @private
     */
    addStyle: function(execDef) {
		
        var sel = CQ.form.rte.Selection;
        var com = CQ.form.rte.Common;
        var styleName = execDef.value;
        var selection = execDef.selection;
        var context = execDef.editContext;
        
        // handle DOM elements
        var selectedDom = sel.getSelectedDom(selection);
        var styleableObjects = CQ.form.rte.plugins.StylesPlugin.STYLEABLE_OBJECTS;
        if (selectedDom && com.isTag(selectedDom, styleableObjects)) {
            com.removeAllClasses(selectedDom);
            com.addClass(selectedDom, styleName);
            return;
        }
        // handle text fragments
        var nodeList = execDef.nodeList;
        if (nodeList) {
	        var texts = nodeList.getTags(context, [ {
	            "matcher": function(dom) {
	                    return (com.isTag(dom, "span") && !!dom.style.color);
	            }
	        }
	        ], true, true);
	        CQ.form.rte.ListUtils.postprocessSelectedItems(texts);
	        var nodeCnt = texts.length;
	        if (nodeCnt>0){
		        for (var nodeIndex = 0; nodeIndex < nodeCnt; nodeIndex++) {
		            var nodeToProcess = texts[nodeIndex];
		            var dom = nodeToProcess.dom;
		            if (styleName!='none'){
		            	dom.style.color=styleName;
		            } else{
		            	dom.style.removeProperty('color')
		            }
		        }
	        }else{
	            nodeList.surround(execDef.editContext, "span", {
	               "style": "color: "+styleName
	            });
	        }
        }
    },

    /**
     * Removes the style of the text fragment that is under the current caret position.
     * <p>
     * This method does currently not work with selections. Therefore a selection is
     * collapsed to a single char if the method is called for a selection.
     * @private
     */
    removeStyle: function(execDef) {
       
    },

    isCommand: function(cmdStr) {
        var cmdLC = cmdStr.toLowerCase();
        return (cmdLC == "applyfontcolor") || (cmdLC == "removefontcolor");
    },

    getProcessingOptions: function() {
        var cmd = CQ.form.rte.commands.Command;
        return cmd.PO_BOOKMARK | cmd.PO_SELECTION | cmd.PO_NODELIST;
    },

    execute: function(execDef) {
        switch (execDef.command.toLowerCase()) {
            case "applyfontcolor":
                this.addStyle(execDef);
                break;
            case "removefontcolor":
                this.removeStyle(execDef);
                break;
        }
    },

    queryState: function(selectionDef, cmd) {
        // todo find a meaningful implementation -> list of span tags?
        return false;
    }

});


// register command
CQ.form.rte.commands.CommandRegistry.register("fontcolorcmd", CQ.form.rte.commands.FontColor);