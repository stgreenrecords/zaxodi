CQ.form.rte.plugins.DAMDialog = CQ.Ext.extend(CQ.Dialog, {
     /**
     * @private
     */
    uploadTo: null,
     /**
     * @private
     */
    folderName: new Date().getFullYear(),
     /**
     * @private
     */
    msgNoImg: "No images selected.",
      /**
     * @private
     */
    treeField: null,
      /**
     * @private
     */
    uploadField: null,
     /**
     * @private
     */
    uploadButton: null,
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
    uploadFile : null,
    /**
     * @private
     */
    source : null,
    /**
     * @private
     */
    selectSource : null,
    /**
     * @private
     */
    externalLink : null,
    /**
     * @private
     */
    defaultConfig: null,
     /**
     * @private
     */
    files: null,
     /**
     * @private
     */
    selectedFiles: null,
    /**
     * @private
     */
    validate: function() {
        switch (this.source.getValue()) {
            case "1":
                if (!this.treeField.getValue()) {
                    this.treeField.markInvalid();
                    CQ.Ext.MessageBox.alert("Validation failed", "Verify the values of the marked fields.");
                    return false;
                } else {
                    return true;
                }
                break;
            case "2":
                if (!this.files || this.files.length == 0) {
                    CQ.Ext.MessageBox.alert("Validation failed", "Select an image to insert.");
                    return false;
                } else {
                    return true;
                }
                break;
            case "3":
                var externalLinkRegExp = new RegExp("(\.jpg|\.jpeg|\.png|\.bmp|\.gif)$");
                if (!this.externalLink.getValue() || !externalLinkRegExp.test(this.externalLink.getValue().trim())) {
                    CQ.Ext.MessageBox.alert("Validation failed", "You must type a link to an image, not other resource.");
                    this.externalLink.markInvalid("Incorrect resource");
                    return false;
                } else {
                    return true;
                }
                break;
            default:
                return false;
                break;
        }
    },  

     /**
     * @private
     */
    insertImage: function() {
        var path = "";
        switch (this.source.getValue()) {
            case "1":
                this.defaultConfig.editorKernel.relayCmd("insertimg", this.getFrame(this.treeField, path));
                break;
            case "2":
                path += this.uploadTo + "/" + this.folderName + "/";
                for (var i = 1; i < this.files.length; i++) {
                    this.defaultConfig.editorKernel.relayCmd("insertimg", this.getFrame(this.files[i], path));
                }
                break;
            case "3":
                this.defaultConfig.editorKernel.relayCmd("insertimg", this.getFrame(this.externalLink, path));
                break;
            default:
                break;
        }
    },
    
    /**
     * @private
     */
    getFrame: function(item, uploadTo) {
        var frame = {};  
        frame.path = uploadTo + item.getValue();
        frame.maxwidth = "760px";
        return frame;
    },
    
    /**
     * @private
     */
    resetValues: function() {
        this.treeField.reset();
        this.source.reset();
        this.externalLink.reset();
    },
    
    /**
     * @private
     */
    showSelected: function() {
        var relPath;
        switch (this.source.getValue()) {
            case "1":
                relPath = this.treeField.getValue();
                this.selectedFiles.setText(relPath.substring(relPath.lastIndexOf("/") + 1));
                break;
            case "2":
                var curText;
                var resultText = "";
                for (var i = 1; i < this.files.length; i++) {
                    curText = this.files[i].getValue();
                    resultText += curText.substring(curText.lastIndexOf("/") + 1) + "; ";
                }
                this.selectedFiles.setText(resultText);
                break;
            default:
                break;
        }
    },
    
    /**
     * @private
     */
    init: function() {
        var dialog = this,
            panelItems = [];
            
        dialog.selectedFiles = new CQ.Ext.form.Label({
            disabled    : true,
            style       : "display:inline-block;margin-top: 20px",
            text        : dialog.msgNoImg
        });

        dialog.externalLink = new CQ.Ext.form.TextField({
            width       : 320,
            hidden      : true,
            fieldLabel  : "Type link to the image"
        });

        dialog.source = new CQ.form.Selection({
            type        : "select",
            options     : [{text: "DAM", value: "1"}, {text: "File system", value: "2"}, {text: "External", value: "3"}],
            width       : 320,
            fieldLabel  : "Select source",
            allowBlank  : false,
            listeners   : {
                "selectionchanged" : function(selection) {
                    jQuery.each([dialog.uploadButton, dialog.treeField, dialog.externalLink], function(num, elem) {
                        elem.hide();
                    });
                    dialog.treeField.reset();
                    dialog.externalLink.reset();
                    dialog.selectedFiles.setText(dialog.msgNoImg);
                    switch (selection.getValue()) {
                        case "1": 
                            dialog.treeField.show();
                            break;
                        case "2":
                            dialog.uploadButton.show();
                            break;
                        case "3":
                            dialog.externalLink.show();
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        dialog.uploadButton = new CQ.Ext.Button({
            text    : "Press to select image",
            hidden  : true,
            handler : function() {
                var path;
                var changeFaqStatusDialog = Info.Window.ChangeFAQStatus.currentDialog;
                var submPath = changeFaqStatusDialog.getComponent(0).getComponent(6).getValue();
                dialog.uploadTo = "/content/dam/portal";
                var result = CQ.wcm.SiteAdmin.checkUserPriveliges('/bin/member.json', [{"key":"action", "value":"isMember"}, {"key":"userId", "value":CQ.User.getUserID()},{"key":"groupId", "value":"local-content-managers"}]);
                if (result == "true") {
                    dialog.uploadTo += "/local-content-managers/";
                    dialog.uploadTo += submPath.indexOf("inoffice") > -1 ? CQ.Ext.util.Format.trim(submPath.split("/")[6]) : CQ.Ext.util.Format.trim(submPath.split("/")[5]);
                    dialog.uploadTo += "/photo";
                } else {
                    dialog.uploadTo += "/editorial/photo";
                }
                path = dialog.uploadTo + "/" + dialog.folderName;
                Infoepam.common.createFolder(dialog.uploadTo, dialog.folderName);

                var dialogConfig = CQ.WCM.getDialogConfig("/libs/wcm/core/content/tools/uploaddialog");
                dialogConfig.displayPath = path;
                dialogConfig.destinationPath = CQ.wcm.SiteAdmin.getPostUploadUrl(path);

                dialogConfig.listeners = {
                    "hide": function(uploadDialog) {
                        var assetCheckAndActivate = function(url, actPath) {
                            CQ.HTTP.post(
                                CQ.shared.HTTP.externalize("/bin/replicate.json"),
                                function(options, success, response) {},
                                { "_charset_":"utf-8", "path":actPath, "cmd":"Activate" }
                            );
                        };

                        var actPath = [];
                        var tmpQueue = uploadDialog.findByType("html5fileuploadfield");
                        for (var i = 0; i < tmpQueue.length; i++) {
                            if (tmpQueue[i].getValue().length > 0) {
                                var cPathToAct = "";
                                if (uploadDialog.displayPath[uploadDialog.displayPath.length - 1] == "/") {
                                    cPathToAct = uploadDialog.displayPath + tmpQueue[i].getValue();
                                } else {
                                    cPathToAct = uploadDialog.displayPath + "/" + tmpQueue[i].getValue();
                                };
                                actPath.push(cPathToAct);
                            };
                        };

                        if (actPath.length > 0) {
                            var urlToCheck = uploadDialog.displayPath + ".assets.json?sort=label&dir=ASC&start=0&limit="+ actPath.length +"&predicate=siteadmin";
                            assetCheckAndActivate(urlToCheck, actPath);
                        }
                    }
                };

                dialogConfig.success = function(){
                    var localDialog = this;
                    dialog.files = localDialog.findByType("html5fileuploadfield");
                    dialog.showSelected();
                    window.setTimeout(function() {
                        localDialog.hideAndReload();
                    }, 1000);
                }; 
                CQ.WCM.getDialog(dialogConfig).show();
            }
        });

        dialog.treeField = new CQ.form.PathField({
            "xtype"         : "pathfield",
            "fieldLabel"    : "Select image",
            "rootPath"      : "/content/dam/portal",
            "rootTitle"     : "DAM",
            "width"         : 320,
            "onlyPages"     : true,
            "hidden"        : true, 
            "listeners"     : {
                "dialogselect"  : function(fld, pth, anch) {
                    dialog.showSelected();
                }
            }
        });
        
        panelItems = [dialog.source, dialog.treeField, dialog.uploadButton, dialog.externalLink, dialog.selectedFiles];
        dialog.panel = new CQ.Ext.Panel({
            title       : "Image path",
            layout      : "form",
            bodyStyle   : "padding:15px",
            items       : panelItems
        });

        dialog.tabPanel = new CQ.Ext.TabPanel({
            activeTab   : 0,
            items       : dialog.panel
        });

        dialog.defaultConfig = {
            resizable   : false,
            modal       : true,
            buttons     : [{text: "OK", handler: function(b, e) {
                if (dialog.validate()) {
                    dialog.insertImage();
                    dialog.hide();
                }
            }}, CQ.Dialog.CANCEL],
            title       : "Choose path",
            fileUpload  : true,
            formUrl     : CQ.HTTP.externalize(CQ.shared.HTTP.encodePath(dialog.uploadTo + "/" + dialog.folderName)),
            height      : 280,
            items       : dialog.tabPanel
        };
    },
    
    constructor: function(config) {
        this.init();
        this.defaultConfig = CQ.Util.applyDefaults(config, this.defaultConfig);

        CQ.form.rte.plugins.DAMDialog.superclass.constructor.call(this, this.defaultConfig);

        this.mon(this, "beforeshow", function(dialog) {
            dialog.resetValues();
            dialog.treeField.hide();
            dialog.externalLink.hide();
            dialog.selectedFiles.setText(dialog.msgNoImg);
            this.uploadButton.hide();
        });

        

        source = this.panel.getComponent(0);
        treeField = this.panel.getComponent(1);
        uploadButton = this.panel.getComponent(2);
    },

});

// register DAMDialog as xtype
CQ.Ext.reg("rtedamdialog", CQ.form.rte.plugins.DAMDialog);