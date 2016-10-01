CQ.form.rte.commands.Quote = CQ.Ext.extend(CQ.form.rte.commands.Command, {
    
    isCommand: function(cmdStr) {
        return (cmdStr.toLowerCase() == "quote");
    }, 
    
    execute: function(execDef) {
        var editorKernel = execDef.component;
        var command = this;  
        var templateSrc = '<div class="RTEquote">'+
            '<div class="RTEbeginQuote">&nbsp;</div>'+
            '<div class="RTEtextQuote" >{text}</div>'+   //<p>
            '<div class="RTEendQuote" align="right">&nbsp;</div>'+
            '<div class="RTEsignQuote" align="right">- {sign}</div>'+
            '</div><br/>';
        var tpl = new CQ.Ext.Template(templateSrc);
		execDef.component.execCmd("inserthtml",tpl.apply(execDef.value));
    }
});

CQ.form.rte.commands.CommandRegistry.register("quote", CQ.form.rte.commands.Quote);