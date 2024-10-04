import { AppNodeBase, createStatementNode, createNode } from "./node";
import { AppStatement } from "./statement";
import { PlanNode } from "../sqlplan/model";
import { AppStorage } from "./storage";
import { addOrUpdate } from "../sqlplan/core";

export function createViewModel(statements: AppStatement[], predicate?: (node: PlanNode) => boolean) {

    const viewModel = new AppNodeViewModel();


    for (const statement of statements) {

        if (statement.hasStatementNode) {

            const currentNode = createStatementNode(statement);
            viewModel.addStatementNode(currentNode);

            if (currentNode.selected()) {
                viewModel.addNode(currentNode);
                attachChildren(currentNode, currentNode.node.children, predicate);
            }
        }
    }
    calculateAndApplyMatric();

    return viewModel.finalize();


    function attachChildren(currentNode: AppNodeBase, children: PlanNode[], predicate?: (node: PlanNode) => boolean) {

        for (const cn of children) {

            if (predicate && predicate(cn)) {
                currentNode.attachedNodes.push(cn);
                attachChildren(currentNode, cn.children, predicate);
            } else {
                const n = createNode(currentNode.statement, cn, currentNode);
                currentNode.children.push(n);
                viewModel.addNode(n);
                viewModel.planNodes.push(n);
                attachChildren(n, cn.children, predicate);
            }
        }
    }


    function calculateAndApplyMatric() {
        let appNodeRow = 0;
        let maxColumn = 0;
        for (const pnNode of viewModel.statementNodes) {
            const metrics = pnNode.calculateMatrix(0, appNodeRow);
            maxColumn = Math.max(maxColumn, metrics.maxColumn);
            appNodeRow = metrics.maxRow;
        }

        appNodeRow = 0;
        for (const pnNode of viewModel.statementNodes) {
            pnNode.applyMatrix(maxColumn);
            pnNode.row = appNodeRow++;
            pnNode.column = 0;
        }
    }
}
export class AppNodeViewModel {
    static default = new AppNodeViewModel();

    storage: AppStorage = new AppStorage();
    nodes: AppNodeBase[] = [];
    planNodes: AppNodeBase[] = [];
    statementNodes: AppNodeBase[] = [];
    batches: AppNodeBase[][] = [];
    expensiveNodes: AppNodeBase[] = [];
    bigDataNodes: AppNodeBase[] = [];
    warningsNodes: AppNodeBase[] = [];
    updated: KnockoutSubscribable<HTMLElement> = new ko.subscribable<HTMLElement>();

    addNode(node: AppNodeBase) {
        node.updated.subscribe((element) => {
            this.updated.notifySubscribers(element);
        });

        this.storage.add(node);

        this.nodes.push(node);

        if (node.node.metrics.isCostly) {
            this.expensiveNodes.push(node);
        }
        if (node.node.metrics.isBigData) {
            this.bigDataNodes.push(node);
        }
        if (node.node.isWarnings) {
            this.warningsNodes.push(node);
        }
    }

    addStatementNode(
        node: AppNodeBase) {
        node.updated.subscribe((element) => {
            this.updated.notifySubscribers(element);
        });

        this.statementNodes.push(node);

        addOrUpdate(
            this.batches,
            node.batchIndex,
            (index) => {
                return [node];
            },
            (index, oldValue) => {
                oldValue.push(node);
                return oldValue;
            });
    }

    toggleAll() {
        // check if all are selected already

        let allSelected = true;
        for (const st of this.statementNodes) {
            if (!st.selected()) {
                allSelected = false;
                break;
            }
        }

        if (allSelected) {
            //deselect, except the first one
            this.statementNodes[0].selected(true);
            for (let index = 1; index < this.statementNodes.length; index++) {
                this.statementNodes[index].selected(false);
            }
        } else {
            for (let index = 0; index < this.statementNodes.length; index++) {
                this.statementNodes[index].selected(true);
            }
        }


    }

    finalize() {
        this.expensiveNodes = this.expensiveNodes.sort((a, b) => {
            return b.node.metrics.relativeCost - a.node.metrics.relativeCost;
        });
        this.bigDataNodes = this.bigDataNodes.sort((a, b) => {
            return b.node.metrics.actualDataSize - a.node.metrics.actualDataSize;
        });
        return this;
    }


}