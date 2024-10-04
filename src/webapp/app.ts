import { Notifications } from "./notifications";
import { initialize as menuInit } from "./menu";
import { planFileManager } from "./planFileManager";
import { PlanFile } from "./planFile";
import { startupInitialize } from "../common/util";
import { PlanFileManager } from "webapp/planFileManager";


startupInitialize();

function addStyle(styles: { [name: string]: number }, el: Element, actual: boolean) {

    let val = (actual) ? el.className : el.getAttribute("class");
    //const val = el.className;

    if (val) {

        if (typeof (val) !== "string") {
            val = (<any>val).baseVal;
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

export function run(id: string | null) {

    const app = new Application(id);

    ko.applyBindings(app, document.body);
    ko.applyBindings(app, document.head);

    menuInit("menubtn", "ham-menu");
}

export function update(planData: string) {

    const planFile = PlanFile.deserialize(planData);
    new PlanFileManager().savePlanFile(planFile.id, JSON.stringify(planFile.properties), planFile.content);


    const app: Application = ko.dataFor(document.body);
    if (app) {
        app.showPlan(null, planFile);
    }
}

export function close() {

    const app: Application = ko.dataFor(document.body);
    if (app) {
        app.closeWindow(null);
    }
}

class Application {

    notifications: Notifications = new Notifications();

    planFile: KnockoutObservable<PlanFile> = ko.observable();

    planFileId: KnockoutComputed<string | null> = ko.pureComputed(() => {
        const pf = this.planFile();
        return !pf ? null : pf.id;
    });

    constructor(id: string | null | PlanFile) {

        if (id) {

            if (typeof id === "string") {
                planFileManager.createFromId(id, (e, d) => {
                    if (e) {
                        this.notifications.show(e, 5);
                        return;
                    }
                    if (d) {
                        this.showPlan(e, d);
                    }
                });
            } else {
                this.showPlan(null, id);
            }
        }
    }

    openFileDialog(data: any, e: Event) {

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
            const files = (<any>e.target).files;

            for (const file of files) {
                planFileManager.createFromFile(file, (e, d) => {
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

    removeRecentFile = (data: any, e: Event) => {
        planFileManager.removePlanFile(data.id);
    }

    openRecentFile = (data: any, e: Event) => {
        planFileManager.createFromId(data.id, (e, d) => {
            if (e) {
                this.notifications.show(e, 5);
                return;
            }
            if (d) {
                this.showPlan(e, d);
            }
        });
    }

    pastePlan(data: any, e: ClipboardEvent) {

        // if (e.originalEvent && e.originalEvent.clipboardData) {
        //     const data = e.originalEvent.clipboardData.getData("text/plain");
        //     if (data) {
        //         planFileManager.createFromClipboard(data, (e, d) => this.showPlan(e, d));
        //     }
        // }
        if (e && e.clipboardData) {
            const data = e.clipboardData.getData("text/plain");
            if (data) {
                planFileManager.createFromClipboard(data, (e, d) => {
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

    closeWindow(data?: any, e?: Event) {
        if (this.planFile()) {
            this.planFile(null);
            window.history.replaceState(null, "Supratimas", location.origin + location.pathname);
        }
        window.close();
    }

    showPlan(err: CallbackError, planFile: PlanFile) {

        if (err) {
            this.notifications.show(err, 5);
            return;
        }

        if (!this.planFile()) {
            this.planFile(planFile);
            window.history.replaceState(null, planFile.name + " - Supratimas", planFile.url);


            planFile.updated.subscribe((newMeta) => {
                planFileManager.savePlanFile(planFile.id, JSON.stringify(planFile.properties));
            });

            const declared: { [name: string]: number } = {};
            addStyle(declared, window.document.body, true);
            const actual: { [name: string]: number } = {};
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
                    (<any>childWindow).supratimas.update(planFileJson);
                });
                if ((<any>childWindow).supratimas) {
                    (<any>childWindow).supratimas.update(planFileJson);
                }
            }
        }
    }

    planFiles = planFileManager.planFiles;
}



