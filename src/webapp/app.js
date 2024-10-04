"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notifications_1 = require("./notifications");
const menu_1 = require("./menu");
const planFileManager_1 = require("./planFileManager");
const planFile_1 = require("./planFile");
const util_1 = require("../common/util");
const planFileManager_2 = require("webapp/planFileManager");
util_1.startupInitialize();
function addStyle(styles, el, actual) {
    let val = (actual) ? el.className : el.getAttribute("class");
    //const val = el.className;
    if (val) {
        if (typeof (val) !== "string") {
            val = val.baseVal;
        }
        if (val) {
            const vals = val.split(" ");
            for (const v of vals) {
                if (styles[v]) {
                    styles[v]++;
                }
                else {
                    styles[v] = 1;
                }
            }
        }
    }
    const len = el.children.length;
    for (let i = 0; i < len; i++) {
        const ch = el.children[i];
        addStyle(styles, ch, actual);
    }
}
function run(id) {
    const app = new Application(id);
    ko.applyBindings(app, document.body);
    ko.applyBindings(app, document.head);
    menu_1.initialize("menubtn", "ham-menu");
}
exports.run = run;
function update(planData) {
    const planFile = planFile_1.PlanFile.deserialize(planData);
    new planFileManager_2.PlanFileManager().savePlanFile(planFile.id, JSON.stringify(planFile.properties), planFile.content);
    const app = ko.dataFor(document.body);
    if (app) {
        app.showPlan(null, planFile);
    }
}
exports.update = update;
function close() {
    const app = ko.dataFor(document.body);
    if (app) {
        app.closeWindow(null);
    }
}
exports.close = close;
class Application {
    constructor(id) {
        this.notifications = new notifications_1.Notifications();
        this.planFile = ko.observable();
        this.planFileId = ko.pureComputed(() => {
            const pf = this.planFile();
            return !pf ? null : pf.id;
        });
        this.removeRecentFile = (data, e) => {
            planFileManager_1.planFileManager.removePlanFile(data.id);
        };
        this.openRecentFile = (data, e) => {
            planFileManager_1.planFileManager.createFromId(data.id, (e, d) => {
                if (e) {
                    this.notifications.show(e, 5);
                    return;
                }
                if (d) {
                    this.showPlan(e, d);
                }
            });
        };
        this.planFiles = planFileManager_1.planFileManager.planFiles;
        if (id) {
            if (typeof id === "string") {
                planFileManager_1.planFileManager.createFromId(id, (e, d) => {
                    if (e) {
                        this.notifications.show(e, 5);
                        return;
                    }
                    if (d) {
                        this.showPlan(e, d);
                    }
                });
            }
            else {
                this.showPlan(null, id);
            }
        }
    }
    openFileDialog(data, e) {
        const id = "reader_open_control";
        const item = document.getElementById(id);
        if (item) {
            item.click();
            return;
        }
        const inputItem = document.createElement("input");
        inputItem.id = "reader_open_control";
        inputItem.multiple = true;
        inputItem.type = "file";
        inputItem.name = "files[]";
        inputItem.style.width = "0";
        inputItem.style.height = "0";
        inputItem.style.overflow = "hidden";
        inputItem.style.display = "fixed";
        inputItem.style.left = "-32000";
        inputItem.style.top = "-32000";
        inputItem.addEventListener("change", (e) => {
            const files = e.target.files;
            for (const file of files) {
                planFileManager_1.planFileManager.createFromFile(file, (e, d) => {
                    if (e) {
                        this.notifications.show(e, 5);
                        return;
                    }
                    if (d) {
                        this.showPlan(e, d);
                    }
                });
            }
        });
        document.body.appendChild(inputItem);
        inputItem.click();
    }
    pastePlan(data, e) {
        // if (e.originalEvent && e.originalEvent.clipboardData) {
        //     const data = e.originalEvent.clipboardData.getData("text/plain");
        //     if (data) {
        //         planFileManager.createFromClipboard(data, (e, d) => this.showPlan(e, d));
        //     }
        // }
        if (e && e.clipboardData) {
            const data = e.clipboardData.getData("text/plain");
            if (data) {
                planFileManager_1.planFileManager.createFromClipboard(data, (e, d) => {
                    if (e) {
                        this.notifications.show(e, 5);
                        return;
                    }
                    if (d) {
                        this.showPlan(e, d);
                    }
                });
            }
        }
    }
    closeWindow(data, e) {
        if (this.planFile()) {
            this.planFile(null);
            window.history.replaceState(null, "Supratimas", location.origin + location.pathname);
        }
        window.close();
    }
    showPlan(err, planFile) {
        if (err) {
            this.notifications.show(err, 5);
            return;
        }
        if (!this.planFile()) {
            this.planFile(planFile);
            window.history.replaceState(null, planFile.name + " - Supratimas", planFile.url);
            planFile.updated.subscribe((newMeta) => {
                planFileManager_1.planFileManager.savePlanFile(planFile.id, JSON.stringify(planFile.properties));
            });
            const declared = {};
            addStyle(declared, window.document.body, true);
            const actual = {};
            addStyle(actual, window.document.body, false);
            const da = [];
            for (const key in declared) {
                if (declared.hasOwnProperty(key)) {
                    da.push(key);
                }
            }
            da.sort();
        }
        else {
            const planFileJson = planFile.serialize();
            const childWindow = window.open(location.origin + location.pathname, planFile.id);
            if (childWindow) {
                childWindow.addEventListener("supratimas", event => {
                    childWindow.supratimas.update(planFileJson);
                });
                if (childWindow.supratimas) {
                    childWindow.supratimas.update(planFileJson);
                }
            }
        }
    }
}
//# sourceMappingURL=app.js.map