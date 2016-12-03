/*
 * Copyright 1997-2008 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */

// TODO comment

CQ.wcm.SiteAdmin.createPage = function() {
    var parentPath = this.getCurrentPath();

    var dialog = CQ.wcm.Page.getCreatePageDialog(parentPath);

    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);

    dialog.on("beforesubmit", function() {
        var template = dialog.findBy(function (comp) {
            return comp["name"] == 'template';
        }, dialog)[0].getValue();
        if (template == "/apps/portal/templates/catalogproducttemplate"){
            var title = dialog.findBy(function (comp) {
                return comp["name"] == 'title';
            }, dialog)[0].getValue();
            var damPath = (parentPath + "/" + title.replace(/[^A-Z0-9]/ig, "-").toLowerCase()).replace("/content","/content/dam");
            CQ.HTTP.post(damPath, null, null);
        }

        admin.mask();
    });


    dialog.success = function() {admin.reloadCurrentTreeNode();};
    dialog.failure = function(){
        admin.unmask();
        CQ.Ext.Msg.alert(
            CQ.I18n.getMessage("Error"),
            CQ.I18n.getMessage("Could not create page.")
        );
    };

    dialog.show();
};

CQ.wcm.SiteAdmin.createSite = function() {
    var admin = this;
    var dlg = CQ.WCM.getDialog("", "cq-siteadmin-csw", true);
    if (!dlg) {
        dlg = new CQ.wcm.CreateSiteWizard();
        dlg.on("beforesubmit", function() {admin.mask();});
        dlg.success = function() {admin.reloadCurrentTreeNode();};
        dlg.failure = function(form, response) {
            admin.unmask();
            CQ.Ext.Msg.alert(
                CQ.I18n.getMessage("Error"),
                CQ.I18n.getMessage("Could not create site: {0}",[response["result"]["Message"]])
            );
        };

        CQ.WCM.registerDialog("cq-siteadmin-csw", dlg);
    }
    dlg.loadContent({
        dstPath: this.getCurrentPath()
    });

    dlg.show();
};

CQ.wcm.SiteAdmin.createLiveCopy = function() {
    var parentPath = this.getCurrentPath();

    var dialog = CQ.WCM.getDialog(CQ.wcm.msm.MSM.Commands.getCreateLiveCopyDialogConfig(parentPath));
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    dialog.on("beforesubmit", function() {admin.mask();});
    dialog.success = function() {admin.reloadCurrentTreeNode();};
    dialog.failure = function(form, response) {
        admin.unmask();
        CQ.Ext.Msg.alert(
            CQ.I18n.getMessage("Error"),
            CQ.I18n.getMessage("Could not create Live Copy: {0}",[response["result"]["Message"]])
        );
    };

    dialog.show();
};

CQ.wcm.SiteAdmin.internalDeletePage = function(force) {
    this.mask();
    var selections = this.getSelectedPages();
    var tree = CQ.Ext.getCmp(this.id + "-tree");
    var list = CQ.Ext.getCmp(this.id + "-grid");

    // collect necessary information
    var paths = [];
    var nodes = [];
    for (var i = 0; i < selections.length; i++) {
        var selection = selections[i];
        paths.push(selection.id);

        // find corresponding tree nodes
        var path = selection.id.split("/");
        var node = tree.getRootNode();
        var rootPath = node.getPath().split("/");
        for (var j = rootPath.length; j < path.length; j++) {
            node = node.findChild("name", path[j]);
        }
        // only add nodes that are available in tree
        if (node) nodes.push(node);
    }

    CQ.Ext.Ajax.request({
        "url":CQ.HTTP.externalize("/bin/wcmcommand"),
        "method":"POST",
        "callback":function(options, success, xhr) {
            var response = CQ.HTTP.buildPostResponseFromHTML(xhr.responseText);
            var status = response.headers[CQ.utils.HTTP.HEADER_STATUS];
            if (status == 200) {
                // remove pages from list and tree
                for (var i = 0; i < selections.length; i++) {
                    list.getStore().remove(selections[i]);
                }
                for (var i = 0; i < nodes.length; i++) {
                    try {
                        nodes[i].remove();
                    } catch (e) {}
                }
                this.unmask();
            } else if (status == 412) {
                this.unmask();
                CQ.Ext.Msg.show({
                    "title":CQ.I18n.getMessage("Delete Page"),
                    "msg":CQ.I18n.getMessage("One or more selected pages are referenced. Click 'yes' to proceed deleting the pages, click 'no' to review the references or 'cancel' to cancel the operation."),
                    "buttons":CQ.Ext.Msg.YESNOCANCEL,
                    "icon":CQ.Ext.MessageBox.QUESTION,
                    "fn":function(btnId) {
                        if (btnId == "yes") {
                            CQ.wcm.SiteAdmin.internalDeletePage.call(this, true);
                        } else if (btnId == "no") {
                            CQ.wcm.SiteAdmin.showReferences.call(this);
                        }
                    },
                    "scope":this
                });
            } else if (status == 500) {
                this.unmask();
                CQ.Notification.notifyFromResponse(response);
            } else {
                this.unmask();
            }
        },
        "params":{
            "path":paths,
            "_charset_":"utf-8",
            "cmd":"deletePage",
            "force": force
        },
        "scope":this
    });
};


CQ.wcm.SiteAdmin.deletePage = function() {
    var selections = this.getSelectedPages();

    var msg = (selections.length > 1) ?
        CQ.I18n.getMessage("You are going to delete the following pages: ") :
        CQ.I18n.getMessage("You are going to delete the following page: ");
    msg += "<br/><br/>";
    var max = 7;
    for (var i=0; i<selections.length; i++) {
        if (i == max) {
            msg += CQ.I18n.getMessage("(and {0} more...)", [selections.length-i], "pages to delete") + "<br/>";
            break;
        }
        var page = CQ.shared.XSS.getXSSRecordPropertyValue(selections[i], "title");
        if (!page) {
            page = selections[i].get("label");
        }
        msg += page + "<br/>";
    }
    msg += "<br/>" + CQ.I18n.getMessage("Are you sure?");

    var title = (selections.length > 1) ?
        CQ.I18n.getMessage("Delete Pages")
        : CQ.I18n.getMessage("Delete Page");

    CQ.Ext.Msg.show({
        "title":title,
        "msg":msg,
        "buttons":CQ.Ext.Msg.YESNO,
        "icon":CQ.Ext.MessageBox.QUESTION,
        "fn":function(btnId) {
            if (btnId == "yes") {
                CQ.wcm.SiteAdmin.internalDeletePage.call(this, false);
            }
        },
        "scope":this
    });
};

CQ.wcm.SiteAdmin.openPage = function(path, type, newWindow, selection) {
    if (type == null) {
        return;
    }

    if (type == "dam:Asset") {
        if (window.CQ_SiteAdmin_id == "cq-damadmin") {
            // asset in dam admin: open asset editor in new tab
            CQ.wcm.DamAdmin.openAsset(path, selection);
        }
        else {
            // asset in site admin: open asset dialog
            if (!CQ.User.getCurrentUser().hasPermissionOn("modify", path)) return;
            var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
            var config = CQ.WCM.getDialogConfig("/libs/wcm/core/content/tools/assetdialog");
            if (!config.success) {
                config.success = function(){admin.reloadPages();};
            }
            if (!config.failure) {
                config.failure = function(){admin.unmask();};
            }


            var locker = selection.data.lockedBy;
            var currentUserID = CQ.User.getUserID();
            var locked = false;
            if(locker.length > 0 && locker != currentUserID){
                locked = true;
            }

            //disable OK when locked
            if(locked){
                config.buttons = [new CQ.Ext.Button({"text": "OK", "disabled": true}), CQ.Dialog.CANCEL];
            }

            var dialog = CQ.WCM.getDialog(config);
            dialog.on("beforesubmit", function(){admin.mask();});
            dialog.loadContent(CQ.HTTP.encodePath(path));

            //disable fields when locked
            if(locked){
                dialog.disableFields();
            }

            dialog.show();

            if(locked){
                var msg = CQ.I18n.getMessage("Locked");
                var description = CQ.I18n.getMessage("This asset is currently locked by {0}", [locker]);
                CQ.Notification.notify(msg, description, 10);
            }



        }
    }
    else if (!/.*([fF]older)/.test(type) == 0) {
        var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
        admin.loadPath(path);
    }
    else if (path.indexOf("/etc/packages") == 0) {
        // http://localhost:4502/crx/packmgr/index.jsp#/etc/packages/adobe/platform/com.adobe.granite.security.content-0.1.9.zip
        var url = CQ.HTTP.externalize("/crx/packmgr/index.jsp");
        url += "#" + path;
        CQ.shared.Util.open(url);
    }
    else if (!/.*([fF]ile)/.test(type)) {
        var url = CQ.HTTP.externalize("/bin/wcmcommand") + "?cmd=open";
        url+= "&_charset_=utf-8";
        url+= "&path=" + encodeURIComponent(path);

        if( CQ.Ext.isIE ) {
            // IE does not support properly the 301 response status which is given by OpenCommand.
            // First request URL to open through a json stream
            // and from json, read URL to open.
            // See bug #22530
            var jsonUrl = CQ.HTTP.addParameter(url, "jsonMode", true);
            var r = CQ.HTTP.eval(jsonUrl);
            url = r["Location"];
        }

        // check for multi window mode
        if (CQ.wcm.SiteAdmin.multiWinMode == undefined) {
            var wm = CQ.User.getCurrentUser().getPreference("winMode");
            CQ.wcm.SiteAdmin.multiWinMode = (wm != "single");
        }

        if (newWindow || CQ.wcm.SiteAdmin.multiWinMode) {
            CQ.shared.Util.open(url);
        } else {
            CQ.shared.Util.load(url);
        }
    }
};

CQ.wcm.SiteAdmin.openPages = function(newWindow, evt) {
    if (typeof newWindow == "object" && evt) {
        newWindow = evt.shiftKey; // workaround for action calls
    }
    var selections = this.getSelectedPages();
    for (var i = 0; i < selections.length; i++) {
        CQ.wcm.SiteAdmin.openPage(selections[i].id, selections[i].get("type"), newWindow, selections[i]);
        newWindow = true; // force new window when opening multiple pages
    }
};

CQ.wcm.SiteAdmin.openFindReplaceDialog = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var path = CQ.wcm.SiteAdmin.getSingleTarget();
        if (!path) {
            return;
        }
        var frDialog = CQ.WCM.getDialog("/libs/wcm/core/content/tools/findreplacedialog");
        frDialog.on("beforesubmit", function(){admin.mask();});
        frDialog.success = function() {admin.reloadCurrentTreeNode();};
        frDialog.failure = function(){admin.unmask()};
        frDialog.loadContent(path);
        frDialog.show();
    }
};

CQ.wcm.SiteAdmin.openPropertiesDialog = function(path, type, dialogPath,locked, lockedBy) {

    var dlgDef = null;
    var title = null;

    if ((type != null) && (type == "cq:Page")) {

        if ((dialogPath == null) || (dialogPath == "")) {
            dlgDef = "/libs/foundation/components/page/dialog.infinity.json";
        } else {
            dlgDef = dialogPath + ".infinity.json";
        }
        title = CQ.shared.XSS.getXSSValue(path);
        title = CQ.I18n.getMessage("Page Properties of {0}", title);

    } else if ((type != null) && (type == "nt:file")) {
        // TODO

    } else if ((type != null) && (/.*\:.*[F|f]older/.test(type)) && type != "nt:folder") {

        if ((dialogPath == null) || (dialogPath == "")) {

            var segment = type.replace(":", "/");
            dlgDef = "/libs/foundation/components/primary/" + segment + "/dialog.overlay.infinity.json";

        } else {
            dlgDef = dialogPath + ".infinity.json";
        }
        title = CQ.shared.XSS.getXSSValue(path);
        title = CQ.I18n.getMessage("Folder Properties of {0}", title);
    }

    if (null != dlgDef) {

        var config = CQ.WCM.getDialogConfig(dlgDef);

        if (locked) {
            config.buttons = [new CQ.Ext.Button({"text": "OK", "disabled": true}), CQ.Dialog.CANCEL];
        }

        var propsDialog = CQ.WCM.getDialog(config, "NEW");
        propsDialog.fieldEditLockMode = true;
        propsDialog.loadContent(path + "/jcr:content");
        propsDialog.setTitle(title);
        propsDialog.setElId(CQ.Util.createId("cq-propsdialog"));

        // for folders, ensure that properties node is nt:unstructure
        if ((type != null) && (/.*\:.*[F|f]older/.test(type)) && type != "nt:folder") {
            propsDialog.addHidden({"./jcr:primaryType": "nt:unstructured"});
        }

        var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
        propsDialog.on("beforesubmit", function() {
            if (admin) {
                admin.mask();
            }
        });
        propsDialog.success = function() {
            if (admin) {
                admin.reloadCurrentTreeNode();
            }
        };
        propsDialog.failure = function() {
            if (admin) {
                admin.unmask();
            }
        };
        propsDialog.on("hide", function() {
            setTimeout(function () {
                propsDialog.destroy();
            }, 500);
        });

        if (locked) {
            propsDialog.disableFields();
        }
        propsDialog.show();

        if (locked) {
            var msg = CQ.I18n.getMessage("Locked");
            var description = CQ.I18n.getMessage("This page is currently locked by {0}", [lockedBy]);
            CQ.Notification.notify(msg, description, 10);
        }
    }
};

CQ.wcm.SiteAdmin.openProperties = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        for (var i=0; i<selections.length; i++) {

            var selection = selections[i];
            var locked = false;
            var lockedBy = selection.data.lockedBy;
            var currentUserID = CQ.User.getUserID();
            if(lockedBy != undefined && lockedBy.length > 0 && lockedBy != currentUserID){
                locked = true;
            }

            CQ.wcm.SiteAdmin.openPropertiesDialog(selections[i].id,
                selections[i].get("type"),
                selections[i].get("dialogPath"), locked, lockedBy);
        }
    }
};

CQ.wcm.SiteAdmin.copyPages = function() {
    this.copySelectionToClipboard();
};

CQ.wcm.SiteAdmin.pastePages = function(button,event) {
    this.pasteFromClipboard(event.shiftKey);
};


CQ.wcm.SiteAdmin.scene7PublishPages = function() {
    var selections = this.getSelectedPages();
    var paths = [];
    var admin = this;
    // check for workflow status of selected pages
    for (var i = 0; i < selections.length; i++) {
        var selection = selections[i];
        var pagePath = selection.id;
        paths[i] = pagePath;

        // check if page is already in workflow
        var url = CQ.HTTP.noCaching("/bin/workflow.json");
        url = CQ.HTTP.addParameter(url, "isInWorkflow", pagePath);
        url = CQ.HTTP.addParameter(url, "_charset_", "UTF-8");
        var response = CQ.HTTP.get(url);
        var isInWorkflow = false;
        if (CQ.HTTP.isOk(response)) {
            var data = CQ.Util.eval(response);
            isInWorkflow = data.status;
        }
        if (isInWorkflow) {
            CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("A selected page is already subject to a workflow!"));
            return;
        }
    }

    var wait = function(ms) {
        var dt = new Date();
        dt.setTime(dt.getTime() + ms);
        while (new Date().getTime() < dt.getTime());
    }
    var data = {
        id:CQ.Util.createId("cq-s7publishdialog"),
        path:paths,
        basePath:this.getCurrentPath()
    };
    var dialog = new CQ.wcm.Scene7PublishDialog(data);
    dialog.addListener("beforesubmit", this.mask, this);
    dialog.success = function(form) {
        for (var i = 0; i < paths.length; i++) {
            var pagePath = paths[i];
            wait(100);
            var params = {
                "_charset_":"UTF-8",
                "model":"/etc/workflow/models/scene7/jcr:content/model",
                "payload":pagePath,
                "payloadType":"JCR_PATH",
                "isInteractiveUpload": "true"
            };

            CQ.HTTP.post("/etc/workflow/instances", function(options, success, response) {
                if (!success) {
                    admin.unmask();
                } else {
                    admin.reloadPages();
                }
            }, params);
        }
    };
    // Override dialog failure method
    var dialogFailure = dialog.failure;
    dialog.failure = function() {
        if (dialogFailure != null) {
            dialogFailure();
        }
        admin.unmask();
    };
    dialog.show();

};


CQ.wcm.SiteAdmin.movePage = function() {
    var selections = this.getSelectedPages();
    var admin = this;
    var paths =[];
    for (var i=0; i<selections.length; i++) {
        paths.push(selections[i].id);
    }
    var isAsset = selections[0].get && selections[0].get("type") == "dam:Asset";
    var isPage = selections[0].get && selections[0].get("type") == "cq:Page";
    var dialog = CQ.wcm.Page.getMovePageDialog(paths, isPage);
    dialog.addListener("beforesubmit", this.mask, this);
    dialog.success = function(form) {
        var path = "";
        var tree = CQ.Ext.getCmp(admin.id + "-tree");
        var root = tree ? tree.getRootNode() : undefined;
        try {
            path = form.findField("destParentPath").getValue();
        } catch (e) {
            path = root ? root.getPath() : "";
        }
        if (isAsset) {
            // for assets it happened sometimes (without timeout) that both
            // the old and the renamed asset were in the json response
            window.setTimeout(function() {
                if(root) root.reload();
                admin.loadPath(path);
            }, 200);
        }
        else {
            if(root) root.reload();
            admin.loadPath(path);
        }
        admin.unmask();
    };
    // Override dialog failure method
    var dialogFailure = dialog.failure;
    dialog.failure = function() {
        if (dialogFailure != null) {
            dialogFailure();
        }
        admin.unmask();
    };
    dialog.show();
};

CQ.wcm.SiteAdmin.showReferences = function() {
    var selections = this.getSelectedPages();
    var paths = [];
    for (var i=0; i<selections.length; i++) {
        paths.push(selections[i].id);
    }
    var data = {
        path: paths
    };
    var dlg = new CQ.wcm.ReferencesDialog(data);
    dlg.on("pageopen", function(d, p) {
        d.close();
        CQ.wcm.SiteAdmin.openPage(p);
    });
    dlg.show();
};

CQ.wcm.SiteAdmin.activatePage = function() {
    var admin = this;
    var paths = [];
    var selections = this.getSelectedPages();
    for (var i = 0; i < selections.length; i++) {
        paths.push(selections[i].id);
    }
    if (CQ.wcm.SiteAdmin.noAsset()) {
        var data = {
            id: CQ.Util.createId("cq-asset-reference-search-dialog"),
            path: paths,
            callback: function(p) {
                admin.mask();
                CQ.wcm.SiteAdmin.internalActivatePage.call(admin, p);
            }
        };
        new CQ.wcm.AssetReferenceSearchDialog(data);
    } else {
        // activate only the selected items
        this.mask();
        CQ.wcm.SiteAdmin.internalActivatePage.call(admin, paths);
    }
};

CQ.wcm.SiteAdmin.internalActivatePage = function(paths, callback) {
    if (callback == undefined) {
        // assume scope is admin and reload grid
        var admin = this;
        callback = function(options, success, response) {
            if (success) admin.reloadPages();
            else admin.unmask();
        };
    }
    CQ.HTTP.post(
        CQ.shared.HTTP.externalize("/bin/replicate.json"),
        callback,
        { "_charset_":"utf-8", "path":paths, "cmd":"Activate" }
    );
};

CQ.wcm.SiteAdmin.deactivatePage = function(pages, callback) {

    // first parameter may be an action or an array of pages - if action, we'll
    // get the selection from the grid explicitly
    var selections = (pages && CQ.Ext.isArray(pages) ? pages : this.getSelectedPages());
    // second parameter may be an event or a callback function - we only need to keep the
    // callback function
    if (!CQ.Ext.isFunction(callback)) {
        callback = undefined;
    }

    var msg = CQ.I18n.getMessage("You are going to deactivate the following pages: ") + "<br/>";
    for (var i=0; i<selections.length; i++) {
        msg += CQ.shared.XSS.getXSSValue(selections[i].id) + "<br/>";
    }
    msg += "<br/>" + CQ.I18n.getMessage("Are you sure?");

    var title = (selections.length > 1) ?
        CQ.I18n.getMessage("Deactivate Pages")
        : CQ.I18n.getMessage("Deactivate Page");

    CQ.Ext.Msg.show({
        "title":title,
        "msg":msg,
        "buttons":CQ.Ext.Msg.YESNO,
        "icon":CQ.Ext.MessageBox.QUESTION,
        "fn":function(btnId) {
            if (btnId == "yes") {
                CQ.wcm.SiteAdmin.internalDeactivatePage.call(this, callback, selections);
            }
        },
        "scope":this
    });
};

CQ.wcm.SiteAdmin.internalDeactivatePage = function(callback, selections) {
    var admin = this;
    if (admin.mask) {
        admin.mask();
    }
    var paths = [];
    selections = selections || admin.getSelectedPages();
    for (var i = 0; i < selections.length; i++) {
        paths.push(selections[i].id);
    }
    CQ.HTTP.post(
        CQ.shared.HTTP.externalize("/bin/replicate.json"),
        callback || function(options, success, response) {
            if (success) admin.reloadPages();
            else admin.unmask();
        },
        { "_charset_":"utf-8", "path":paths, "cmd":"Deactivate" }
    );
};

/***
 * The rollout action of the file-menu
 */
CQ.wcm.SiteAdmin.rolloutPage = function() {
    var selections = this.getSelectedPages();
    if (selections.length==1) {
        CQ.wcm.SiteAdmin.openRolloutDialog.call(admin, selections[0].id);
    } else {
        var paths = new Array();
        for(var i=0; i<selections.length; ++i){
            paths.push(selections[i].id)
        }
        var admin = this;
        var rolloutWizard = new CQ.wcm.msm.RolloutWizard({
            "path": paths,
            "hideComponents": true,
            "hideRolloutPlan": true,
            "isBackground": true,
            "listeners" : {
                "beforesubmit": {
                    "fn": function(){admin.mask();}
                }
            }
        });
        rolloutWizard.success = function() {
            CQ.Ext.getCmp(admin.id + "-tree").getSelectionModel().getSelectedNode().reload();
            CQ.Ext.getCmp(admin.id + "-grid").getSelectionModel().clearSelections();
            admin.reloadPages();
        };
        rolloutWizard.failure = function(){admin.unmask();};
        rolloutWizard.show();
    }
};

/**
 * Open a separate rollout-dialog for every selected page,
 * retrieve the corresponding blueprint.json and populate the
 * selection widget.
 * @param {String} path      The path of the selected page
 * @param {String} type      The type of the selected page (expected to be cq:Page)
 */
CQ.wcm.SiteAdmin.openRolloutDialog = function(path, type){
    var rolloutWizard = new CQ.wcm.msm.RolloutWizard({
        "path": path,
        "hideComponents": true
    });
    rolloutWizard.show();
};

// @private
// @since 5.5
CQ.wcm.SiteAdmin.lock = function(cmd, admin) {
    admin.mask();
    var paths = [];
    var selections = admin.getSelectedPages();
    for (var i=0; i<selections.length; i++) {
        paths.push(selections[i].id);
    }
    CQ.HTTP.post(
        CQ.shared.HTTP.externalize("/bin/wcmcommand"),
        function(options, success, response) {
            if (success) {
                admin.reloadPages();
            }
        },
        { "_charset_":"utf-8", "path":paths, "cmd":cmd },
        admin
    );
};

CQ.wcm.SiteAdmin.lockPage = function() {
    CQ.wcm.SiteAdmin.lock("lockPage", this);
};

CQ.wcm.SiteAdmin.unlockPage = function() {
    CQ.wcm.SiteAdmin.lock("unlockPage", this);
};

// @since 5.5
CQ.wcm.SiteAdmin.lockNode = function() {
    CQ.wcm.SiteAdmin.lock("lockNode", this);
};

// @since 5.5
CQ.wcm.SiteAdmin.unlockNode = function() {
    CQ.wcm.SiteAdmin.lock("unlockNode", this);
};

CQ.wcm.SiteAdmin.startWorkflow = function() {
    var admin = this;
    var id = CQ.Util.createId("cq-workflowdialog");
    var startWorkflowDialog = {
        "jcr:primaryType": "cq:Dialog",
        "title":CQ.I18n.getMessage("Start Workflow"),
        "id": id,
        "formUrl":"/etc/workflow/instances",
        "params": {
            "_charset_":"utf-8",
            "payloadType":"JCR_PATH"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "model": {
                    "xtype":"combo",
                    "name":"model",
                    "id": id + "-model",
                    "hiddenName":"model",
                    "fieldLabel":CQ.I18n.getMessage("Workflow"),
                    "displayField":"label",
                    "valueField":"wid",
                    "title":CQ.I18n.getMessage("Available Workflows"),
                    "selectOnFocus":true,
                    "triggerAction":"all",
                    "allowBlank":false,
                    "editable":false,
                    "store":new CQ.Ext.data.Store({
                        "proxy":new CQ.Ext.data.HttpProxy({
                            "url":"/libs/cq/workflow/content/console/workflows.json",
                            "method":"GET"
                        }),
                        "baseParams": { tags: 'wcm' },
                        "reader":new CQ.Ext.data.JsonReader(
                            {
                                "totalProperty":"results",
                                "root":"workflows"
                            },
                            [ {"name":"wid"}, {"name":"label"}, {"name": CQ.shared.XSS.getXSSPropertyName("label")} ]
                        )
                    }),
                    "tpl": new CQ.Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="x-combo-list-item">',
                        '{[CQ.I18n.getVarMessage(CQ.shared.XSS.getXSSTablePropertyValue(values, \"label\"))]}',
                        '</div>',
                        '</tpl>'
                    )
                },
                "comment": {
                    "jcr:primaryType": "cq:TextArea",
                    "fieldLabel":CQ.I18n.getMessage("Comment"),
                    "name":"startComment",
                    "height":200
                },
                "title": {
                    xtype: 'textfield',
                    name:'workflowTitle',
                    fieldLabel:CQ.I18n.getMessage('Workflow Title')
                }
            }
        },
        "okText":CQ.I18n.getMessage("Start")
    };
    var dialog = CQ.WCM.getDialog(startWorkflowDialog);

    var selections = this.getSelectedPages();
    for (var i=0; i<selections.length; i++) {
        var selection = selections[i];
        var pagePath = selection.id;

        // check if page is already in workflow
        var url = CQ.HTTP.noCaching("/bin/workflow.json");
        url = CQ.HTTP.addParameter(url, "isInWorkflow", pagePath);
        url = CQ.HTTP.addParameter(url, "_charset_", "UTF-8");
        var response = CQ.HTTP.get(url);
        var isInWorkflow = false;
        if (CQ.HTTP.isOk(response)) {
            var data = CQ.Util.eval(response);
            isInWorkflow = data.status;
        }
        if (!isInWorkflow) {
            dialog.addHidden({ "payload":pagePath });
        } else {
            CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("Page is already subject to a workflow!"));
            return;
        }
    }
    dialog.on("beforesubmit", function(){admin.mask();});
    dialog.success = function(){admin.reloadPages();};
    dialog.failure = function(){
        admin.unmask();
        CQ.Ext.Msg.alert(CQ.I18n.getMessage("Error"),
            CQ.I18n.getMessage("Could not start workflow."));
    };
    dialog.show();
};

CQ.wcm.SiteAdmin.openLinkChecker= function() {
    CQ.Util.reload(window, CQ.HTTP.externalize("/etc/linkchecker.html"));
};

CQ.wcm.SiteAdmin.openLanguageCopy= function() {
    var admin = this;
    var dlg = new CQ.wcm.LanguageCopyDialog({
        path: this.getCurrentPath(),
        id: CQ.Util.createId("cq-languagecopydialog")
    });
    dlg.on("beforesubmit", function(){admin.mask();});
    dlg.success = function() {
        CQ.Ext.getCmp(admin.id + "-tree").getSelectionModel().getSelectedNode().reload();
        admin.reloadPages();
    };
    dlg.failure = function() {
        admin.unmask();
    };

    dlg.show();
};

CQ.wcm.SiteAdmin.openBlueprintEditor= function() {
    var admin = this;
    var data = {
        "xtype": "dialog",
        "height": 660,
        "width": 810,
        "items": {
            "xtype": "tabpanel",
            items: [{
                "xtype": "blueprinteditor",
                "masterPath": this.getCurrentPath(),
                "path": "/etc/msm/msm1"
            }]
        },
        "buttons": [
            {
                "text":CQ.I18n.getMessage("OK"),
                "handler":function() {
                    //TODO
                }
            },
            CQ.Dialog.CANCEL
        ]
    };

    var dlg = CQ.WCM.getDialog(data);
    dlg.success = function() {
        //TODO
//            CQ.Ext.getCmp(admin.id + "-tree").getSelectionModel().getSelectedNode().reload();
//            admin.reloadPages();
    };
    dlg.failure = function(){
        CQ.Ext.Msg.alert(
            CQ.I18n.getMessage("Error"),
            CQ.I18n.getMessage("Could not edit blueprint."));
    };
    dlg.show();
};


CQ.wcm.SiteAdmin.restoreVersion = function() {
    var admin = this;
    // always get a new dialog. see bug #18824
    var dialog = CQ.WCM.getDialog("/libs/wcm/core/content/tools/restoreversiondialog", "NEW");
    dialog.setElId(CQ.Util.createId("cq-restoreversiondialog"));
    dialog.loadContent(this.getCurrentPath(), true);
    dialog.on("beforesubmit", function(){admin.mask();});
    dialog.success = function() {
        CQ.Ext.getCmp(admin.id + "-tree").getSelectionModel().getSelectedNode().reload();
        admin.reloadPages();
    };
    dialog.failure = function(){admin.unmask();};
    dialog.show();
};

CQ.wcm.SiteAdmin.restoreTree = function() {
    var admin = this;
    var dialog = CQ.WCM.getDialog("/libs/wcm/core/content/tools/restoretreedialog");
    dialog.setElId(CQ.Util.createId("cq-restoretreedialog"));
    dialog.loadContent(this.getCurrentPath(), true);
    dialog.on("beforesubmit", function(){admin.mask();});
    dialog.success = function() {
        CQ.Ext.getCmp(admin.id + "-tree").getSelectionModel().getSelectedNode().reload();
        admin.reloadPages();
    };
    dialog.failure = function(){admin.unmask();};
    dialog.show();
};

CQ.wcm.SiteAdmin.createAssetShare = function () {

    var parentPath = this.getCurrentPath();
    var dialog = CQ.wcm.Page.getCreateAssetShareDialog(parentPath);
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);

    dialog.on("beforesubmit", function () {
        admin.mask();
    });

    dialog.success = function () {
        admin.reloadCurrentTreeNode();
    };
    dialog.failure = function () {
        admin.unmask();
        CQ.Ext.Msg.alert(
            CQ.I18n.getMessage("Error"),
            CQ.I18n.getMessage("Could not create asset share.")
        );
    };

    dialog.show();
};

CQ.wcm.SiteAdmin.internalCreateAssetShare = function(parentPath, label, title, vtype) {

};

CQ.wcm.SiteAdmin.createFolder = function(action, event, vtype) {
    var tree = CQ.Ext.getCmp(this.id + "-tree");
    var selectedNode;
    try {
        selectedNode = tree.getSelectionModel().getSelectedNode();
    } catch (e) {
    }
    if (!selectedNode) {
        return;
    }
    if (!vtype) {
        vtype = "itemname";
    }
    // show dialog
    var createFolderDialog = {
        "jcr:primaryType": "cq:Dialog",
        "title":CQ.I18n.getMessage("Create Folder"),
        "id": CQ.Util.createId("cq-createfolderdialog"),
        "height": 240,
        "params": {
            "_charset_":"utf-8"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "label": {
                    "fieldLabel":CQ.I18n.getMessage("Name"),
                    "fieldDescription":CQ.I18n.getMessage('The name that will appear in the URL, e.g. "myfolder"'),
                    "name":"label",
                    "vtype":vtype
                },
                "title": {
                    "fieldLabel":CQ.I18n.getMessage("Title"),
                    "fieldSubLabel":CQ.I18n.getMessage("Optional"),
                    "fieldDescription":CQ.I18n.getMessage('A separate title for the navigation, e.g. "My Folder"'),
                    "name":"title"
                }
            }
        },
        "buttons": {
            "jcr:primaryType":"cq:WidgetCollection",
            "custom": {
                "text":CQ.I18n.getMessage("Create"),
                "cls": "cq-btn-create",
                "handler":function() {
                    var title = this.getField("title").getValue();
                    var label = this.getField("label").getValue();
                    if (!label) {
                        label = title ? title : CQ.I18n.getMessage("Folder").toLowerCase();
                    }
                    if (!CQ.Ext.form.VTypes[vtype](label)) {
                        var dialog = this;
                        var msg = CQ.Ext.form.VTypes[vtype + "Text"];
                        msg += "<br/><br/>";
                        msg += CQ.I18n.getMessage("Click 'Yes' to have the name auto-corrected and continue, or 'No' to cancel and change the name.");
                        CQ.Ext.Msg.confirm(
                            CQ.I18n.getMessage('Invalid Name'),
                            msg,
                            function(btnId) {
                                if (btnId == 'yes') {
                                    CQ.wcm.SiteAdmin.internalCreateFolder(selectedNode, label, title, vtype);
                                    dialog.hide();
                                } else {
                                    dialog.getField("label").markInvalid(CQ.Ext.form.VTypes[vtype + "Text"]);
                                }
                            }
                        );
                    } else {
                        CQ.wcm.SiteAdmin.internalCreateFolder(selectedNode, label, title, vtype);
                        this.hide();
                    }
                }
            },
            "cancel":CQ.Dialog.CANCEL
        }
    };
    var dialog = CQ.WCM.getDialog(createFolderDialog);
    dialog.show();
};

CQ.wcm.SiteAdmin.internalCreateFolder = function(selectedNode, name, title, vtype) {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    admin.mask();

    if (vtype == "name") {
        name = CQ.Ext.form.VTypes.makeName(name);
    } else {
        name = CQ.Ext.form.VTypes.makeItemname(name);
    }

    var parentPath = selectedNode.getPath();
    var isPackageFolder = (/\/etc\/packages(\/.*)?/.test(parentPath));

    // create params
    var params = {
        "./jcr:primaryType":"sling:OrderedFolder",
        "./jcr:content/jcr:primaryType":"nt:unstructured",
        ":name": name,
        "_charset_":"utf-8"
    };
    if (title) {
        params["./jcr:content/jcr:title"] = title;
    }

    if (isPackageFolder) {
        // special treatment for package folders
        params = {
            "_charset_":"utf-8",
            "name": name,
            "cmd": "createFolder"
        };
        if (title) {
            params["title"] = title;
        }
    }

    // POST folder definition
    CQ.HTTP.post(CQ.shared.HTTP.encodePath(parentPath + "/"),
        function(options, success, response) {
            if (success) {
                // refresh tree
                var tree = selectedNode.getOwnerTree();
                if (selectedNode != tree.getRootNode()) {
                    var selectedPath = selectedNode.getPath();
                    selectedNode.parentNode.reload(function() {
                        tree.selectPath(selectedPath, null, function(success, node) {
                            if (success) {
                                node.expand();
                            }
                        });
                    });
                } else {
                    tree.getRootNode().reload();
                    CQ.Ext.getCmp(window.CQ_SiteAdmin_id).reloadPages();
                }
            }
            else {
                admin.unmask();
            }
        },
        params
    );
};

CQ.wcm.SiteAdmin.uploadFiles = function() {
    var tree = CQ.Ext.getCmp(this.id + "-tree");
    var admin = this;
    var selectedNode;
    try {
        selectedNode = tree.getSelectionModel().getSelectedNode();
    } catch (e) {
    }
    if (!selectedNode) {
        return;
    }
    // show dialog
    var path = selectedNode.getPath();
    var displayPath = path;
    var maxLength = 40;
    if (displayPath.length > maxLength) {
        var i = path.indexOf("/", path.length - maxLength);
        displayPath = '<span qtip="' + CQ.shared.Util.htmlEncode(CQ.shared.XSS.getXSSValue(path)) + '">...' +
            CQ.shared.XSS.getXSSValue(path.substring(i != -1 ? i : path.lastIndexOf("/"))) +
            '</span>';
    } else {
        displayPath = CQ.shared.XSS.getXSSValue(displayPath);
    }

    var dialogConfig = CQ.WCM.getDialogConfig("/libs/wcm/core/content/tools/uploaddialog");
    dialogConfig.displayPath = displayPath;
    dialogConfig.admin = admin;
    dialogConfig.destinationPath = CQ.wcm.SiteAdmin.getPostUploadUrl(path);
    CQ.WCM.getDialog(dialogConfig).show();
};

CQ.wcm.SiteAdmin.createPackage = function() {
    var tree = CQ.Ext.getCmp(this.id + "-tree");
    var admin = this;
    var selectedNode;
    try {
        selectedNode = tree.getSelectionModel().getSelectedNode();
    } catch (e) {
    }
    if (!selectedNode) {
        return;
    }
    // show dialog
    var path = selectedNode.getPath();
    var groupName = path.substring(14);
    // show dialog
    var uploadDlg = {
        "jcr:primaryType": "cq:Dialog",
        "title":CQ.I18n.getMessage("New Package"),
        "formUrl": CQ.HTTP.externalize("/etc/packages"),
        "params": {
            "cmd" : "create"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "name": {
                    "xtype":"textfield",
                    "fieldLabel":CQ.I18n.getMessage("Package Name"),
                    "name":"packageName",
                    allowBlank: false
                },
                "group": {
                    "xtype":"textfield",
                    "fieldLabel":CQ.I18n.getMessage("Group Name"),
                    "name":"groupName",
                    "value": groupName
                },
                "version": {
                    "xtype":"textfield",
                    "fieldLabel":CQ.I18n.getMessage("Version"),
                    "name":"packageVersion"
                }
            }
        }
    };
    var dialog = CQ.WCM.getDialog(uploadDlg);
    dialog.failure = function(dlg, response) {
        var msg = response.result.Message;
        if (msg.indexOf("javax.jcr.AccessDeniedException")>=0) {
            msg = CQ.I18n.getMessage("Unable to create package: Insufficient access rights.");
        } else {
            msg = CQ.I18n.getVarMessage(msg);
        }
        CQ.Ext.Msg.alert(
            CQ.I18n.getMessage("Error"),
            msg);
    };
    dialog.success = function(dlg, response) {
        var path = response.result.Path;
        var idx = path.lastIndexOf('/');
        var pPath = path.substring(0, idx);
        // refresh tree and grid
        if (selectedNode.getPath() == pPath) {
            admin.reloadPages();
        }
        selectedNode.reload(function() {
            tree.selectPath(pPath, null, function(success, node) {
                if (success) {
                    node.expand();
                }
            });
        });
    };
    dialog.show();
};

CQ.wcm.SiteAdmin.download = function() {
    try {
        var selection = this.getSelectedPages();

        var paths = [];
        // filter folders
        for (var i = 0; i < selection.length; i++) {
            if (selection[i].get("type") != "dam:Asset") continue;
            paths.push(CQ.HTTP.encodePath(selection[i].id));
        }

        var filename = paths.length > 1 ?
        "AEM " + new Date().format("d-M-Y H.i") + " (" + paths.length + " assets).zip" :
        paths[0].substring(paths[0].lastIndexOf("/") + 1) + ".zip";

        var url = CQ.HTTP.externalize(paths[0] + ".assetdownload.zip/" + filename);
        if (paths.length > 1) url = CQ.HTTP.addParameter(url, "path", paths);
        url = CQ.HTTP.addParameter(url, "_charset_", "utf-8");
        window.open(url, "AssetDownloadWindow");
    }
    catch (e) {}
};

CQ.wcm.SiteAdmin.doSearch = function() {
    try {
        var searchPanel = CQ.Ext.getCmp(window.CQ_SiteAdminSearch_id);
        if(searchPanel) {
            searchPanel.performSearch();
        }
    }
    catch(e) {}
}

/* action conditions (scope is a CQ.PrivilegedAction) */

CQ.wcm.SiteAdmin.canDoFolderOp = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var type = admin.getType(this.path);
        if (type && (/.*\:.*[F|f]older/.test(type)
            || type == "nt:unstructured")) {
            return true;
        }
        // special check to allow special folder creation for package folders
        if (type == "cq/packaging/components/manager") {
            return true;
        }
    }
    return false;
};

CQ.wcm.SiteAdmin.canUploadFile = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var type = admin.getType(this.path);
        if (type && (/.*\:.*[F|f]older/.test(type)
            || type == "nt:unstructured")) {
            return true;
        }
    }
    return false;
};

CQ.wcm.SiteAdmin.canCreatePackage = function() {
    return this.path.indexOf("/etc/packages") == 0;
};

CQ.wcm.SiteAdmin.canDeleteReplicatedPage = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        // For each selected page, the user must have the replication privilege if the page is replicated
        var selections = admin.getSelectedPages();
        if (selections.length > 0) {
            var user = CQ.User.getCurrentUser();
            for (var i = 0; i < selections.length; i++) {
                var path = selections[i].id;
                if (CQ.wcm.SiteAdmin.isReplicatedPage(selections[i]) && !user.hasPermissionOn("replicate", path)) {
                    return false;
                }
            }
            return true;
        }
    }

    return false;
};

CQ.wcm.SiteAdmin.isFolder = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var type = admin.getType(this.path);
        if (type && /.*\:.*[F|f]older/.test(type)) {
            return true;
        }
    }
    return false;
};

CQ.wcm.SiteAdmin.noFolder = function() {
    return !CQ.wcm.SiteAdmin.canDoFolderOp.call(this);
};

/**
 * Determines if publishing is allowed for the selected items
 */
CQ.wcm.SiteAdmin.isPublishToS7Allowed = function() {
    var hasSelection = CQ.wcm.SiteAdmin.hasAnySelection();
    var s7PublishAllowed = false;
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        s7PublishAllowed = admin.canPublishToScene7;
    }
    return hasSelection && s7PublishAllowed;
};

CQ.wcm.SiteAdmin.hasAnySelection = function() {
    return CQ.wcm.SiteAdmin.hasListSelection() ||
        CQ.wcm.SiteAdmin.hasTreeSelection();
};

CQ.wcm.SiteAdmin.hasSingleSelection = function() {
    var grid = CQ.wcm.SiteAdmin.getActiveGrid();
    if (grid) {
        var selections = grid.getSelectionModel().getSelections();
        return selections.length == 1 || (selections.length == 0 && CQ.wcm.SiteAdmin.hasTreeSelection());
    }
    return false;
};

CQ.wcm.SiteAdmin.hasListSelection = function() {
    var grid = CQ.wcm.SiteAdmin.getActiveGrid();
    if (grid) {
        var selections = grid.getSelectionModel().getSelections();
        return selections.length > 0;
    }
    return false;
};

CQ.wcm.SiteAdmin.hasSingleListSelection = function() {
    var grid = CQ.wcm.SiteAdmin.getActiveGrid();
    if (grid) {
        var selections = grid.getSelectionModel().getSelections();
        return selections.length == 1;
    }
    return false;
};

CQ.wcm.SiteAdmin.hasTreeSelection = function() {
    var tree = CQ.Ext.getCmp(window.CQ_SiteAdmin_id + "-tree");
    if (tree) {
        var selectedNode = tree.getSelectionModel().getSelectedNode();
        return selectedNode != null;
    }
};

CQ.wcm.SiteAdmin.canPaste = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        return admin.hasClipboardSelection();
    }
};

CQ.wcm.SiteAdmin.isAsset = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        for (var i=0; i<selections.length; i++) {
            try {
                if (selections[i].get("type") == "dam:Asset") {
                    return true;
                }
            } catch (e) {}
        }
        return false;
    }
};


CQ.wcm.SiteAdmin.deleteMetadataTemplate = function() {
    var dlg = new CQ.dam.DeleteMetadataTemplate();
    dlg.show();
}


CQ.wcm.SiteAdmin.noAsset = function() {
    return !CQ.wcm.SiteAdmin.isAsset();
};


CQ.wcm.SiteAdmin.isPage = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        for (var i=0; i<selections.length; i++) {
            try {
                if (selections[i].get("type") == "cq:Page") {
                    return true;
                }
            } catch (e) {}
        }
        return false;
    }
};

CQ.wcm.SiteAdmin.isReplicatedPage = function(record) {
    if (record) {
        var replication = record.get("replication");
        if (replication && replication.published) {
            return replication.action == "ACTIVATE";
        }
    }
    return false;
};

CQ.wcm.SiteAdmin.isLiveCopySource = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        for (var i=0; i<selections.length; i++) {
            try {
                if (selections[i].get(CQ.wcm.msm.MSM.PARAM_IS_SOURCE)) {
                    return true;
                }
            } catch (e) {}
        }
        return false;
    }
};

/** privilege target provider (scope is a CQ.PrivilegedAction) */

CQ.wcm.SiteAdmin.getAnyTarget = function() {
    return CQ.wcm.SiteAdmin.getTargetFromList() ||
        CQ.wcm.SiteAdmin.getTargetFromTree();
};

CQ.wcm.SiteAdmin.getAllTargets = function() {
    return CQ.wcm.SiteAdmin.getMultipleTargetsFromList() ||
        CQ.wcm.SiteAdmin.getTargetFromTree();
};

CQ.wcm.SiteAdmin.getMultipleTargetsFromList = function() {
    if (CQ.wcm.SiteAdmin.hasListSelection()) {
        var grid = CQ.wcm.SiteAdmin.getActiveGrid();
        if (grid) {
            var selections = grid.getSelectionModel().getSelections();
            var pathArray = [];
            for(var i = 0; i < selections.length; i++) {
                pathArray[i] = selections[i].id;
            }
        }
        return pathArray;
    }
    return null;
};


CQ.wcm.SiteAdmin.getSingleTarget = function() {
    if (CQ.wcm.SiteAdmin.hasListSelection()) {
        // make sure list selection is single
        if (!CQ.wcm.SiteAdmin.hasSingleListSelection()) {
            return null;
        } else {
            return CQ.wcm.SiteAdmin.getTargetFromList();
        }
    } else {
        // no list selection, use tree
        return CQ.wcm.SiteAdmin.getTargetFromTree();
    }
};


CQ.wcm.SiteAdmin.getTargetFromList = function() {
    if (CQ.wcm.SiteAdmin.hasListSelection()) {
        var grid = CQ.wcm.SiteAdmin.getActiveGrid();
        if (grid) {
            var selections = grid.getSelectionModel().getSelections();
            return selections[0].id;
        }
    }
    return null;
};

CQ.wcm.SiteAdmin.getTargetFromTree = function() {
    if (CQ.wcm.SiteAdmin.hasTreeSelection()) {
        var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
        if (admin) {
            return admin.getCurrentPath();
        }
    }
    return null;
};

CQ.wcm.SiteAdmin.getParentPath = function(path) {
    return path.substring(0, path.lastIndexOf("/"));
};

CQ.wcm.SiteAdmin.getActiveGrid = function() {
    var grid = CQ.Ext.getCmp(window.CQ_SiteAdmin_id + "-grid");
    var tabPanel = CQ.Ext.getCmp(window.CQ_SiteAdmin_id + "-tabpanel");
    if (tabPanel) {
        var g = CQ.Ext.getCmp(tabPanel.getActiveTab().id + "-grid");
        if(g) {
            grid = g;
        }
    }
    return grid;
};

CQ.wcm.SiteAdmin.checkFolder = function(folderPath) {
    var status = CQ.HTTP.get(folderPath).status;
    if (status == "404") {
        var parent = CQ.wcm.SiteAdmin.getParentPath(folderPath);
        CQ.wcm.SiteAdmin.checkFolder(parent);
        var params = { "./jcr:primaryType":"nt:folder" };
        CQ.HTTP.post(folderPath,
            undefined,
            params
        );
    }
};

CQ.wcm.SiteAdmin.scheduleForActivation = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    // show dialog
    var scheduleForActivationDialog = {
        "jcr:primaryType": "cq:Dialog",
        "height": 240,
        "title":CQ.I18n.getMessage("Activate Later"),
        "id": CQ.Util.createId("cq-activate-later-dialog"),
        "params": {
            "_charset_":"utf-8"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "absTime": {
                    "xtype": "datetime",
                    "fieldLabel":CQ.I18n.getMessage("Activation Date"),
                    "name":"absTime",
                    "allowBlank": false
                }
            }
        },
        "buttons": {
            "jcr:primaryType":"cq:WidgetCollection",
            "custom": {
                "text":CQ.I18n.getMessage("OK"),
                "cls": "cq-btn-create",
                "handler":function() {
                    if (this.form.isValid()) {
                        admin.mask();
                        var dlg = this;
                        //#35320 - force blur to get newest value in IE
                        if(CQ.Ext.isIE) this.getField("absTime").onBlur();
                        var dateTime = this.getField("absTime").getValue();

                        var selections = admin.getSelectedPages();
                        var paths = [];
                        for (var i = 0; i < selections.length; i++) {
                            paths.push(selections[i].id);
                        }
                        if (CQ.wcm.SiteAdmin.noAsset()) {
                            var data = {
                                id: CQ.Util.createId("cq-asset-reference-search-dialog"),
                                path: paths,
                                callback: function(p) {
                                    CQ.wcm.SiteAdmin.internalScheduleForActivation.call(admin, dateTime, p);
                                    dlg.hide();
                                }
                            };
                            new CQ.wcm.AssetReferenceSearchDialog(data);
                        } else {
                            CQ.wcm.SiteAdmin.internalScheduleForActivation.call(admin, dateTime, paths);
                            this.hide();
                        }
                    } else {
                        CQ.Ext.Msg.show({
                            title: CQ.I18n.getMessage('Validation Failed'),
                            msg: CQ.I18n.getMessage('Verify the values of the marked fields.'),
                            buttons: CQ.Ext.Msg.OK,
                            icon: CQ.Ext.Msg.ERROR
                        });
                    }
                }
            },
            "cancel":CQ.Dialog.CANCEL
        }
    };
    var dialog = CQ.WCM.getDialog(scheduleForActivationDialog);
    dialog.show();
};

CQ.wcm.SiteAdmin.internalScheduleForActivation = function(date, paths) {
    var admin = this;
    var params = {
        "_charset_":"UTF-8",
        "model":"/etc/workflow/models/scheduled_activation/jcr:content/model",
        "absoluteTime": date ? date.getTime() : new Date().getTime(),
        "payload":paths,
        "payloadType":"JCR_PATH"
    };
    CQ.HTTP.post("/etc/workflow/instances",
        function(options, success, response) {
            if (!success) {
                admin.unmask();
                CQ.Ext.Msg.alert(
                    CQ.I18n.getMessage("Error"),
                    CQ.I18n.getMessage("Could not schedule page for activation."));
            } else {
                admin.reloadPages();
            }
        },
        params
    );
};

CQ.wcm.SiteAdmin.scheduleForDeactivation = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    // show dialog
    var scheduleForActivationDialog = {
        "jcr:primaryType": "cq:Dialog",
        "height":240,
        "title":CQ.I18n.getMessage("Deactivate Later"),
        "id": CQ.Util.createId("cq-deactivate-later-dialog"),
        "params": {
            "_charset_":"utf-8"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "absTime": {
                    "xtype": "datetime",
                    "fieldLabel":CQ.I18n.getMessage("Deactivation Date"),
                    "name":"absTime",
                    "allowBlank": false
                }
            }
        },
        "buttons": {
            "jcr:primaryType":"cq:WidgetCollection",
            "custom": {
                "text":CQ.I18n.getMessage("OK"),
                "cls": "cq-btn-create",
                "handler":function() {
                    if (this.form.isValid()) {
                        admin.mask();
                        //#35320 - force blur to get newest value in IE
                        if(CQ.Ext.isIE) this.getField("absTime").onBlur();
                        var dateTime = this.getField("absTime").getValue();

                        var selections = admin.getSelectedPages();
                        var paths = [];
                        for (var i = 0; i < selections.length; i++) {
                            paths.push(selections[i].id);
                        }
                        // create params
                        var params = {
                            "_charset_":"UTF-8",
                            "model":"/etc/workflow/models/scheduled_deactivation/jcr:content/model",
                            "absoluteTime": dateTime ? dateTime.getTime() : new Date().getTime(),
                            "payload":paths,
                            "payloadType":"JCR_PATH"
                        };

                        CQ.HTTP.post("/etc/workflow/instances",
                            function(options, success, response) {
                                if (!success) {
                                    CQ.Ext.Msg.alert(
                                        CQ.I18n.getMessage("Error"),
                                        CQ.I18n.getMessage("Could not schedule page for deactivation."));
                                } else {
                                    admin.reloadPages();
                                }
                            },
                            params
                        );
                        this.hide();
                    } else {
                        CQ.Ext.Msg.show({
                            title: CQ.I18n.getMessage('Validation Failed'),
                            msg: CQ.I18n.getMessage('Verify the values of the marked fields.'),
                            buttons: CQ.Ext.Msg.OK,
                            icon: CQ.Ext.Msg.ERROR
                        });
                    }
                }
            },
            "cancel":CQ.Dialog.CANCEL
        }
    };
    var dialog = CQ.WCM.getDialog(scheduleForActivationDialog);
    dialog.show();
};




/**
 * Returns true if all selected items are either not locked at all or locked by
 * the current user.
 * @return {boolean}
 */
CQ.wcm.SiteAdmin.notLocked = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        for (var i=0; i<selections.length; i++) {
            try {
                var selection = selections[i];
                if(typeof(selection.data) !== 'undefined' && selection.data != null){
                    var lockedBy = selection.data.lockedBy;
                    //TODO get currently logged in user
                    var currentUserID = CQ.User.getUserID();
                    if(lockedBy.length > 0 && lockedBy != currentUserID){
                        return false;
                    }
                }
            } catch (e) {}
        }
        return true;
    }
};

/**
 * Returns true if one or more of the selected items are not locked by any user.
 * @return {boolean}
 * @since 5.5
 */
CQ.wcm.SiteAdmin.lockable = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        for (var i=0; i<selections.length; i++) {
            try {
                var selection = selections[i];
                if (typeof(selection.data) !== 'undefined' && selection.data != null) {
                    var lockedBy = selection.data.lockedBy;
                    if (lockedBy.length == 0) {
                        // node not locked >> current user can lock
                        return true;
                    }
                }
            } catch (e) {}
        }
    }
    return false;
};

/**
 * Returns true if one or more of selected items are unlockable, i.e. locked by the the current user.
 * @return {boolean}
 * @since 5.5
 */
CQ.wcm.SiteAdmin.unlockable = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    if (admin) {
        var selections = admin.getSelectedPages();
        var currentUserID = CQ.User.getUserID();
        for (var i=0; i<selections.length; i++) {
            try {
                var selection = selections[i];
                if (typeof(selection.data) !== 'undefined' && selection.data != null) {
                    var lockedBy = selection.data.lockedBy;
                    if (lockedBy.length > 0 && lockedBy == currentUserID) {
                        // node locked by current user >> current user can unlock
                        return true;
                    }
                }
            } catch (e) {}
        }
    }
    return false;
};