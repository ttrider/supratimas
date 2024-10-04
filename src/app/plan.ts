import { AppStatement } from "./statement";
import { NodeView } from "./view";
import { Plan } from "../sqlplan/model";
import { Selector } from "../common/selector";
import { NodeViewMeta } from "../app/view";
import { createViewModel } from "./nodeViewModel";

export class AppPlan {

    private statementSelector: Selector<AppStatement>;

    statementCommandName?: string;
    statementCommandHandler: (st: any) => void = () => { };
    addToWorkspaceHandler?: () => void;// = () => { };

    get name(): string {
        return this.sqlplan.name;
    }

    // get relativeCost(): KnockoutObservable<number> {
    //     return this.plan.relativeCost;
    // }

    nodeView: KnockoutObservable<NodeView>;
    indexText: KnockoutObservable<string>;
    queryText: KnockoutObservable<string>;

    nodeViewMetadata: NodeViewMeta;
    nodeViewMetadataUpdated: KnockoutSubscribable<NodeViewMeta> = new ko.subscribable();

    sqlplan: Plan;
    private batches: number;

    constructor(plan: Plan, nodeViewMeta: NodeViewMeta) {

        this.sqlplan = plan;
        this.nodeViewMetadata = nodeViewMeta;
        this.nodeViewMetadataUpdated.extend({ rateLimit: 500 });

        const statements: AppStatement[] = [];

        this.batches = 0;
        for (const batch of this.sqlplan.batches) {
            for (const st of batch.statements) {
                statements.push(new AppStatement(this, st, this.batches));
            }
            this.batches++;
        }

        this.statementSelector = new Selector<AppStatement>("statement-selector", statements);

        this.updateStatementCost(this.statementSelector.selectedItems());
        this.nodeView = ko.observable(this.computeNodeView());
        this.indexText = ko.observable(this.computeIndexText());
        this.queryText = ko.observable(this.computeQueryText());

        this.statementSelector.selectedItems.subscribe((selected) => {
            this.updateStatementCost(selected);
            this.indexText(this.computeIndexText());
            this.queryText(this.computeQueryText());
            this.nodeView(this.computeNodeView());
        });

        this.statementSelector.selectedItems.subscribe(() => {
            // update relative cost

            const items = this.statementSelector.items();
            let sum = items.reduce((s, item) => {
                s += item.absStatementCost;
                return s;
            }, 0);

            items.forEach(item => {
                item.relativeStatementCost(item.absStatementCost / sum);
            })

        });
    }

    removeStatement(appStatement: AppStatement) {
        if (appStatement && this.statementSelector) {
            this.statementSelector.remove(appStatement);
        }
    }
    updateStatementCost(selected: AppStatement[]) {
        if (selected.length === 0) {
            return;
        }

        if (selected.length === 1) {
            selected[0].selectedStatementCost(1);
            return;
        }

        let total = 0;
        for (const statement of selected) {
            if (statement.relativeStatementCost() !== undefined) {
                total += statement.relativeStatementCost();
            }
        }
        for (const statement of selected) {
            if (statement.relativeStatementCost() !== undefined) {
                statement.selectedStatementCost(statement.relativeStatementCost() / total);
            }
        }
    }

    computeNodeView() {
        const nv = this.processStatements(
            (statement) => statement,
            (statements) =>
                new NodeView(this, this.nodeViewMetadata,
                    createViewModel(statements),
                    createViewModel(statements, (cn) => (!cn.metrics.isCostly && cn.children.length > 0)),
                    createViewModel(statements, (cn) => (cn.children.length === 1))
                )
            ,
            () => new NodeView(this, this.nodeViewMetadata)
        );

        return nv;
    }

    computeIndexText() {
        return this.processBatchStatements((statement) => statement.indexText);
    }
    computeQueryText() {
        return this.processBatchStatements((statement) => statement.queryText);
    }


    updateNodeViewMetadata(metadata: NodeViewMeta) {
        let updated = false;
        if (metadata) {

            if (metadata.scale != null && this.nodeViewMetadata.scale !== metadata.scale) {
                this.nodeViewMetadata.scale = metadata.scale;
                updated = true;
            }
            if (metadata.scrollLeft != null && this.nodeViewMetadata.scrollLeft !== metadata.scrollLeft) {
                this.nodeViewMetadata.scrollLeft = metadata.scrollLeft;
                updated = true;
            }
            if (metadata.scrollTop != null && this.nodeViewMetadata.scrollTop !== metadata.scrollTop) {
                this.nodeViewMetadata.scrollTop = metadata.scrollTop;
                updated = true;
            }
            if (metadata.showInfo != null && this.nodeViewMetadata.showInfo !== metadata.showInfo) {
                this.nodeViewMetadata.showInfo = metadata.showInfo;
                updated = true;
            }
        }
        if (updated) {
            this.nodeViewMetadataUpdated.notifySubscribers(this.nodeViewMetadata);
        }
    }


    private processBatchStatements(statementHandler: (statement: AppStatement) => string | undefined): string | null {

        const batches: string[][] = [];

        for (const statement of this.statementSelector.items()) {

            const selected = statement.selected();
            if (selected) {


                if (!batches[statement.batchIndex]) {
                    batches[statement.batchIndex] = [];
                }
                const statementLines = batches[statement.batchIndex];


                let ts = statementHandler(statement);

                if (ts) {
                    const lines = ts.split("\n");

                    for (let i = 0; i < lines.length; i++) {
                        statementLines.push(lines[i]);
                    }

                    statementLines.push("");
                }
            }
        }

        const statements = [];
        for (const batch of batches) {
            if (batch && batch.length > 0) {

                statements.push(batch.join("\r\n"));
            }
        }

        if (statements.length > 0) {
            return statements.join("\r\nGO\r\n\r\n");
        }

        return null;
    }

    private processStatements<TS, TR>(
        statementHandler: (statement: AppStatement, selected: boolean) => TS,
        resultsHandler: (results: TS[]) => TR,
        emptyHandler: () => TR): TR {

        const results: TS[] = [];
        for (const statement of this.statementSelector.items()) {

            let ts = statementHandler(statement, statement.selected());
            if (ts !== undefined && ts !== null) {
                results.push(ts);
            }
        }
        if (results.length > 0) {
            return resultsHandler(results);
        }
        return emptyHandler();
    }
}