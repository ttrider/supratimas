import { DataInfo } from './dataInfo';
import { stringItem } from '../common/stringBuilder';
import { Warning } from './Warning';
import { Metrics } from './metrics';


export class Plan {
    statements: Array<PlanStatement> = [];
    batches: Array<PlanBatch> = [];

    constructor(public name: string) {
    }

    postProcessing() {
        const cost = this.batches.reduce((sum, item) => sum + item.postProcessing(), 0);
        this.batches.forEach(item => item.applyCost(cost));
    }
}

export class PlanBatch {
    statements: Array<PlanStatement> = [];

    constructor(public plan: Plan) {
    }

    postProcessing() {
        return this.statements.reduce((cost, item) => cost + item.postProcessing(), 0);
    }

    applyCost(cost: number) {
        this.statements.forEach((item) => item.applyCost(cost));
    }
}

export class PlanStatement {
    static lastid = 1;
    id: string;
    statementText?: string;
    missingIndexText?: string;
    relativeStatementCost?: number;
    subtreeCost: number = 0;
    absIoCost: number = 0.0;
    absCpuCost: number = 0.0;
    root?: PlanNode;

    warnings: Warning[] = [];

    ansi: string[] = [];

    get plan(): Plan {
        return this.batch.plan;
    }

    get statementInfo() {
        if (this.statementText) {
            return (this.ansi) ? "SET " + this.ansi.join("; SET ") + "\r\n\r\n" + this.statementText : this.statementText;
        }
    }

    constructor(public batch: PlanBatch, public wssid?: string) {
        this.id = 'statementid_' + (PlanStatement.lastid++).toString();
    }

    setEstimateIO(value: number | undefined) {
        this.absIoCost += (value !== undefined ? value : 0);
    }
    setEstimateCPU(value: number | undefined) {
        this.absCpuCost += (value !== undefined ? value : 0);
    }
    setStatementSubTreeCost(value?: number) {
        if (value != undefined)
            this.subtreeCost = value;
    }
    setStatementText(value?: string) {
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

    applyCost(totalCost: number) {

        this.relativeStatementCost = (totalCost === 0) ? 0.0 : this.subtreeCost / totalCost;
    }
}

export class PlanNode {
    static lastNodeId = 1;
    nodeId: number = PlanNode.lastNodeId++;
    iconTemplate?: string;


    nameSet: (string | (() => string))[] = [];
    flags: string[] = [];

    children: Array<PlanNode> = [];




    dataInfo: DataInfo = new DataInfo();
    metrics: Metrics = new Metrics();

    warnings: Warning[] = [];
    get isWarnings() {
        return this.warnings.length > 0;
    }

    constructor(public statement: PlanStatement) {

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

    addNodeWarning(title: string, properties?: { [name: string]: stringItem }) {
        const w = new Warning(title);
        w.addProperties(properties);
        this.statement.warnings.push(w);
        this.warnings.push(w);
        return w;
    }
}
