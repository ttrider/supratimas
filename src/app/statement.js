"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selector_1 = require("../common/selector");
class AppStatement extends selector_1.SelectorItem {
    constructor(plan, statement, batchIndex) {
        super(() => {
            return this.statement.id;
        });
        this.plan = plan;
        this.statement = statement;
        this.selectedStatementCost = ko.observable(1);
        this.batchIndex = batchIndex;
        this.relativeStatementCost = ko.observable(this.statement.relativeStatementCost);
    }
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
}
exports.AppStatement = AppStatement;
//# sourceMappingURL=statement.js.map