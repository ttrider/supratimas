import { startupInitialize, crc32 } from "../common/util";
import { NodeViewMeta } from "../app/view";
import { parse } from "../sqlplan/saxparser";
import { Plan } from "../sqlplan/model";
import { AppPlan } from "../app/plan";
import { AppStatement } from "../app/statement";

startupInitialize();

export function addPlan(planText: string) {

    console.log("addPlan");
    console.log(planText);

    let app: Application = ko.dataFor(document.body);
    if (!app) {
        console.log("new Application()");
        app = new Application();
        ko.applyBindings(app, document.body);
        ko.applyBindings(app, document.head);
    }
    app.showPlan(planText);
}

class Application {

    id?: string;
    content?: string;

    nodeViewMetadata: NodeViewMeta = {
        scrollLeft: 0,
        scrollTop: 0,
        scale: 1,
        showInfo: true
    };
    data?: Plan;
    plan: KnockoutObservable<AppPlan | undefined> = ko.observable();

    showPlan(planText: string) {
        if (!planText) {
            return;
        }
        this.id = crc32(planText).toString(36);
        this.content = planText;
        this.data = parse(this.id, this.content);

        const appPlan = new AppPlan(this.data, this.nodeViewMetadata);

        const m = (window as any).marshal;
        if (m) {
            if (m.isWorkspace()) {
                appPlan.statementCommandName = "remove-statement";
                appPlan.statementCommandHandler = (statement: AppStatement) => {

                    appPlan.removeStatement(statement);

                    if (m.removeFromWorkspace) {
                        m.removeFromWorkspace(statement.wssid);
                    }

                };
            } else {
                appPlan.addToWorkspaceHandler = () => {
                    m.addToWorkspace(planText);
                };
            }
        }
        this.plan(appPlan);
    }

}
