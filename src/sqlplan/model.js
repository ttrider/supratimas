"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataInfo_1 = require("./dataInfo");
const Warning_1 = require("./Warning");
const metrics_1 = require("./metrics");
class Plan {
    constructor(name) {
        this.name = name;
        this.statements = [];
        this.batches = [];
    }
    postProcessing() {
        const cost = this.batches.reduce((sum, item) => sum + item.postProcessing(), 0);
        this.batches.forEach(item => item.applyCost(cost));
    }
}
exports.Plan = Plan;
class PlanBatch {
    constructor(plan) {
        this.plan = plan;
        this.statements = [];
    }
    postProcessing() {
        return this.statements.reduce((cost, item) => cost + item.postProcessing(), 0);
    }
    applyCost(cost) {
        this.statements.forEach((item) => item.applyCost(cost));
    }
}
exports.PlanBatch = PlanBatch;
class PlanStatement {
    constructor(batch, wssid) {
        this.batch = batch;
        this.wssid = wssid;
        this.subtreeCost = 0;
        this.absIoCost = 0.0;
        this.absCpuCost = 0.0;
        this.warnings = [];
        this.ansi = [];
        this.id = 'statementid_' + (PlanStatement.lastid++).toString();
    }
    get plan() {
        return this.batch.plan;
    }
    get statementInfo() {
        if (this.statementText) {
            return (this.ansi) ? "SET " + this.ansi.join("; SET ") + "\r\n\r\n" + this.statementText : this.statementText;
        }
    }
    setEstimateIO(value) {
        this.absIoCost += (value !== undefined ? value : 0);
    }
    setEstimateCPU(value) {
        this.absCpuCost += (value !== undefined ? value : 0);
    }
    setStatementSubTreeCost(value) {
        if (value != undefined)
            this.subtreeCost = value;
    }
    setStatementText(value) {
        if (!value) {
            return;
        }
        this.statementText = value;
    }
    postProcessing() {
        if (this.root) {
            this.root.postProcessing();
        }
        return this.subtreeCost;
    }
    applyCost(totalCost) {
        this.relativeStatementCost = (totalCost === 0) ? 0.0 : this.subtreeCost / totalCost;
    }
}
PlanStatement.lastid = 1;
exports.PlanStatement = PlanStatement;
class PlanNode {
    constructor(statement) {
        this.statement = statement;
        this.nodeId = PlanNode.lastNodeId++;
        this.nameSet = [];
        this.flags = [];
        this.children = [];
        this.dataInfo = new dataInfo_1.DataInfo();
        this.metrics = new metrics_1.Metrics();
        this.warnings = [];
    }
    get isWarnings() {
        return this.warnings.length > 0;
    }
    postProcessing() {
        let cost = this.metrics.absSubtreeCost;
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.postProcessing();
            cost -= child.metrics.absSubtreeCost;
        }
        this.metrics.absCost = Math.max(cost, 0.0);
        this.metrics.calculateRelativeCost(this.statement.absCpuCost, this.statement.absIoCost, this.statement.subtreeCost, this.statement.subtreeCost);
    }
    addNodeWarning(title, properties) {
        const w = new Warning_1.Warning(title);
        w.addProperties(properties);
        this.statement.warnings.push(w);
        this.warnings.push(w);
        return w;
    }
}
PlanNode.lastNodeId = 1;
exports.PlanNode = PlanNode;
//# sourceMappingURL=model.js.map