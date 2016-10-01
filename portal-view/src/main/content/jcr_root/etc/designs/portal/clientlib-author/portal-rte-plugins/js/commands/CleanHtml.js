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
CQ.form.rte.commands.CleanHtml = CQ.Ext.extend(CQ.form.rte.commands.Command, {

      isCommand: function(cmdStr) {
        var cmdLC = cmdStr.toLowerCase();
        return (cmdLC == "cleanhtml");
    },

    getProcessingOptions: function() {
        var cmd = CQ.form.rte.commands.Command;
        return cmd.PO_BOOKMARK | cmd.PO_SELECTION | cmd.PO_NODELIST;
    },

    execute: function(execDef) {
    	
     
    	
    	var html=execDef.editContext.doc.body.innerHTML;
    	
    	var plainText=html.replace(/<(?!\/?a(?=>|\s.*>))\/?.*?>/ig,""); 
    	execDef.editContext.doc.body.innerHTML=plainText;
    	
       },

    queryState: function(selectionDef, cmd) {
        // todo find a meaningful implementation -> list of span tags?
        return false;
    }

});


// register command
CQ.form.rte.commands.CommandRegistry.register("cleanhtml", CQ.form.rte.commands.CleanHtml);