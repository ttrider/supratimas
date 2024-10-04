"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../common/util");
const saxparser_1 = require("../sqlplan/saxparser");
const plan_1 = require("../app/plan");
util_1.startupInitialize();
function addPlan(planText) {
    console.log("addPlan");
    console.log(planText);
    let app = ko.dataFor(document.body);
    if (!app) {
        console.log("new Application()");
        app = new Application();
        ko.applyBindings(app, document.body);
        ko.applyBindings(app, document.head);
    }
    app.showPlan(planText);
}
exports.addPlan = addPlan;
class Application {
    constructor() {
        this.nodeViewMetadata = {
            scrollLeft: 0,
            scrollTop: 0,
            scale: 1,
            showInfo: true
        };
        this.plan = ko.observable();
    }
    showPlan(planText) {
        if (!planText) {
            return;
        }
        this.id = util_1.crc32(planText).toString(36);
        this.content = planText;
        this.data = saxparser_1.parse(this.id, this.content);
        const appPlan = new plan_1.AppPlan(this.data, this.nodeViewMetadata);
        const m = window.marshal;
        if (m) {
            if (m.isWorkspace()) {
                appPlan.statementCommandName = "remove-statement";
                appPlan.statementCommandHandler = (statement) => {
                    appPlan.removeStatement(statement);
                    if (m.removeFromWorkspace) {
                        m.removeFromWorkspace(statement.wssid);
                    }
                };
            }
            else {
                appPlan.addToWorkspaceHandler = () => {
                    m.addToWorkspace(planText);
                };
            }
        }
        this.plan(appPlan);
    }
}
//# sourceMappingURL=app.js.map