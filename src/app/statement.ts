import { PlanStatement, PlanNode } from "../sqlplan/model";
import { SelectorItem } from "../common/selector";
import { AppPlan } from "./plan";

export class AppStatement extends SelectorItem {
    batchIndex: number;
    selectedStatementCost: KnockoutObservable<number> = ko.observable(1);

    get queryText() {
        return this.statement.statementInfo;
    }
    get statementText() {
        return this.statement.statementText ? this.statement.statementText : "";
    }
    get indexText() {
        return this.statement.missingIndexText;
    }

    get wssid() {
        return this.statement.wssid;
    }
    relativeStatementCost: KnockoutObservable<number>;

    get absStatementCost() {
        if (this.statement.root) {
            return this.statement.subtreeCost;
        }
        return 0.0;
    }

    get hasStatementNode() {
        return !!this.statement.root;
    }
    get statementNode() {
        if (this.statement.root) {
            return this.statement.root;
        }
        throw new Error("statement root is missing");
    }

    get id() {
        return this.statement.id;
    }


    constructor(public plan: AppPlan, private statement: PlanStatement, batchIndex: number) {
        super(() => {
            return this.statement.id;
        });
        this.batchIndex = batchIndex;
        this.relativeStatementCost = ko.observable(this.statement.relativeStatementCost);
    }

}