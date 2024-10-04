
import { formatByteSize, formatPercentage } from "../sqlplan/formatter";
import { PlanNode } from "../sqlplan/model";
import { StringCollection } from '../common/stringCollection';
import { AppStatement } from "./statement";
import { IColumn, ColumnInfo, ColumnUsageType, SeekPredicateSet } from '../sqlplan/dataInfo';
import { formatScalar } from "../sqlplan/saxformat";
import { Warning } from "sqlplan/warning";


const normalNameLength = 25;
const maxNameLength = 80;

export function createNode(statement: AppStatement, planNode: PlanNode, parentNode: AppNodeBase) {
    return new AppNode(statement, planNode, parentNode);
}

export function createStatementNode(statement: AppStatement) {
    return new AppStatementNode(statement);
}

interface IInitializeSet {
    nameSet: Array<string | undefined>;
    statistics: { name: string, value: string, warning: boolean }[];
}

export class AppNodeBase {

    static lastNodeId: number = 1;

    children: AppNodeBase[] = [];
    parent?: AppNodeBase;
    selected: KnockoutObservable<boolean>;

    warnings: Section<Warning[]>;
    metrics: Section<string[][]>;

    showOutputColumns: KnockoutObservable<boolean> = ko.observable(false);
    showInputColumns: KnockoutObservable<boolean> = ko.observable(false);

    inputPanelData: InputPanelData[];



    selectable: boolean = false;

    attachedNodes: PlanNode[] = [];

    nodeId: string;
    parentNodeId?: string;

    row: number = 0;
    column: number = 0;

   

    nameSet: StringCollection;

    flags?: string;

    statistics: Array<{ name: string, value: string, warning: boolean }> = [];

    updated: KnockoutSubscribable<HTMLElement> = new ko.subscribable<HTMLElement>();


    get hasInputPanelData() {
        return this.inputPanelData.length > 0;
    }

    get hasOutputPanelData() {
        return true;
    }

    get batchIndex() {
        return this.statement.batchIndex;
    }

    get iconTemplate() {
        return this.node.iconTemplate ? this.node.iconTemplate : null;
    }

    get estimatedRows() {
        if (this.node.metrics.rows > 0) {

            const estimated = Math.round(this.node.metrics.rows);

            const records = this.node.metrics.actualRowCount;

            const p = estimated > records ? records / estimated : estimated / records;
            if (p < 0.9) {
                return estimated.toString();
            }
        }
        return null;
    }
    get isCostly(): boolean {
        return this.node.metrics.isCostly;
    }



    get formattedCost(): string {
        return "";
    }





    private columnInfoSet?: ColumnInfo[];
    get columnsInfo() {

        const di = this.node.dataInfo;

        if (this.columnInfoSet === undefined) {
            const ret: ColumnInfo[] = [];

            addColumnInfo(ret, "Defined Values", "defined_value", (i) => i.formattedName, true, c => !c.usedBy("output"));
            addColumnInfo(ret, "Output", "output", (i) => i.formattedName, true);
            addColumnInfo(ret, "Group By", "groupby", (i) => i.displayName);
            addColumnInfo(ret, "Order By", "orderby", (i) => i.displayName + " " + i.ascending);

            this.columnInfoSet = ret;
        }
        return this.columnInfoSet;


        function addColumnInfo(ret: ColumnInfo[], title: string, key: ColumnUsageType, formatter: (item: IColumn) => string, sort?: boolean, filter?: (item: IColumn) => boolean) {

            let columnSet = di.getColumns(key, sort);
            if (filter) {
                columnSet = columnSet.filter(filter);
            }
            if (columnSet.length > 0) {
                ret.push(
                    {
                        title: title,
                        columns: columnSet.reduce((ret, item, index, array) => {
                            ret.push(formatter(item));
                            return ret;
                        },
                            [] as string[])
                    });
            }
            return ret;
        }
    }




    createInputPanelData() {
        const di = this.node.dataInfo;

        const ret: InputPanelData[] = [];
        for (const js of inputPanelConfig.joins) {
            const jsi = getJoinSet(js);
            if (jsi) {
                ret.push(jsi);
            }
        }


        formatSeekPredicateSet(di.seekPredicateSet);
        for (let index = 0; index < di.partitionSeekPredicates.length; index++) {
            formatSeekPredicateSet(di.partitionSeekPredicates[index], index);
        }

        return ret;

        function getJoinSet(config: InputPanelJoinConfig) {
            const expressions: string[] = [];
            if (di.expressions[config.id]) {
                const formattedExpression = formatScalar(di, di.expressions[config.id])();
                const formattedParts = formattedExpression.split(";\n");
                for (const part of formattedParts) {
                    expressions.push(part);
                }
                
            }

            const columns = di.getColumns(config.id);

            const ret: InputPanelData = {
                title: config.title,
                columnsTitle: config.columnsTitle ? config.columnsTitle : "",
                columns,
                expressionTitle: config.expressionTitle ? config.expressionTitle : "",
                expressions: expressions,
                hasColumns: columns.length > 0,
                hasExpressions: expressions.length > 0
            };

            if (ret.hasColumns || ret.hasExpressions) {
                return ret;
            }
        }

        function formatSeekPredicateItems(title: string, items: Array<(item: string) => string>): InputPanelData | undefined {
            if (items && items.length > 0) {
                const expressions: string[] = [];
                for (const item of items) {
                    expressions.push(item(" "));
                }

                return {
                    title,
                    columnsTitle: "",
                    columns: [],
                    expressionTitle: "",
                    expressions,
                    hasColumns: false,
                    hasExpressions: true
                };
            }
        }

        function formatSeekPredicateSet(sps: SeekPredicateSet, index?: number) {
            if (!sps) return;

            const tp = index != undefined ? "Part #" + (index + 1) + " " : "";

            let seekItems = formatSeekPredicateItems(tp + "Seek Prefix", sps.prefixSet)
            if (seekItems) {
                ret.push(seekItems);
            }
            seekItems = formatSeekPredicateItems(tp + "Seek Is Not NULL", sps.isNotNullSet)
            if (seekItems) {
                ret.push(seekItems);
            }
            seekItems = formatSeekPredicateItems(tp + "Seek Start Range", sps.startRangeSet)
            if (seekItems) {
                ret.push(seekItems);
            }
            seekItems = formatSeekPredicateItems(tp + "Seek End Range", sps.endRangeSet)
            if (seekItems) {
                ret.push(seekItems);
            }
        }
    }


    constructor(public statement: AppStatement,
        public node: PlanNode,
        selected?: KnockoutObservable<boolean>,
        parent?: AppNodeBase) {

        this.nodeId = "Node" + node.nodeId;
        this.parent = parent;

        if (selected === undefined) {
            this.selected = ko.observable(false);
            this.selectable = false;
        } else {
            this.selected = selected;
            this.selectable = true;
        }

        const init = this.initialize();

        this.nameSet = new StringCollection(init.nameSet, normalNameLength, maxNameLength);
        this.nameSet.updated.subscribe((element) => this.updated.notifySubscribers(element));

        this.statistics = init.statistics;

        this.inputPanelData = this.createInputPanelData();

        this.metrics = new Section(node.metrics.metrics, this.updated, (item) => item.length > 0);
        this.warnings = new Section(this.node.warnings, this.updated, (item) => item.length > 0);
    }

    initialize(): IInitializeSet {
        return {
            nameSet: [],
            statistics: []
        };
    }



    calculateMatrix(column: number, row: number): { maxColumn: number, maxRow: number } {
        let maxColumn = column;
        let maxRow = row;
        this.row = row;

        if (this.children.length > 0) {
            column++;
            for (let childNode of this.children) {
                childNode.parentNodeId = this.nodeId;
                let max = childNode.calculateMatrix(column, maxRow);

                if (max.maxColumn > maxColumn) {
                    maxColumn = max.maxColumn;
                }
                maxRow = max.maxRow;
            }
        }
        else {
            maxRow++;
        }
        return { maxColumn: maxColumn, maxRow: maxRow }
    }

    applyMatrix(maxColumn: number) {
        let column = maxColumn;

        for (let childNode of this.children) {

            let pos = childNode.applyMatrix(maxColumn);
            if (column > pos) {
                column = pos;
            }
        }

        this.column = column;
        return column - 1;
    }

    
    toggleInputColumns() {
        this.showInputColumns(!this.showInputColumns());
        this.updated.notifySubscribers();
    }
    toggleOutputColumns() {
        this.showOutputColumns(!this.showOutputColumns());
        this.updated.notifySubscribers();
    }
}

export class AppNode extends AppNodeBase {


    get formattedDataSize(): string {
        return formatByteSize(this.node.metrics.actualDataSize);
    }

    get formattedRecords(): string {
        let ret = this.node.metrics.actualRowCount.toString();
        const est = this.estimatedRows;
        if (est) {
            ret += `(${est})`;
        }
        return ret;
    }

    get formattedSubtreeCost(): string {
        return formatPercentage(this.node.metrics.relativeSubtreeCost * this.statement.selectedStatementCost());
    }

    get formattedCost(): string {
        return formatPercentage(this.node.metrics.relativeCost * this.statement.selectedStatementCost());
    }

    initialize(): IInitializeSet {

        const { tableName, indexName } = this.getFormattedTableName(this.node);

        let nameSet: string[] = [];

        for (const nameItem of this.node.nameSet) {
            if (typeof nameItem === "function") {
                nameSet.push(nameItem());
            } else {
                nameSet.push(nameItem);
            }
        }


        if (tableName) {
            nameSet.push(tableName);
        }
        if (indexName) {
            nameSet.push(indexName);
        }

        const statistics = this.node.metrics.statistics;

        return {
            nameSet: nameSet,
            statistics: statistics
        };
    }

    getFormattedTableName(node: PlanNode) {
        const t = node.dataInfo.rowSetObject;
        if (t) {
            return { tableName: t.Table, indexName: t.Index };
        }
        return { tableName: "", indexName: "" };
    }

    constructor(statement: AppStatement, node: PlanNode, parent: AppNodeBase) {
        super(statement, node, undefined, parent);

        this.flags = node.flags.join(", ");
    }
}

export class AppStatementNode extends AppNodeBase {

    select: () => void;
    toggle: () => void;

    get queryText() {
        return this.statement.queryText;
    }

    get formattedCost(): string {
        return formatPercentage(this.statement.relativeStatementCost());
    }
    get cost(): number {
        return this.node.metrics.relativeCost;
    }
    get formattedSubtreeCost(): string {
        return formatPercentage(this.statement.selectedStatementCost());
    }



    initialize(): IInitializeSet {
        return {
            nameSet: [this.statement.statementText],
            statistics: []
        };
    }

    constructor(public statement: AppStatement) {
        super(statement, statement.statementNode, statement.selected);
        this.select = statement.select.bind(statement);
        this.toggle = statement.toggle.bind(statement);
    }
}

export class Section<T> {

    visible: KnockoutObservable<boolean>;

    constructor(public content: T, private updated: KnockoutSubscribable<HTMLElement>, private enabledHandler: (content: T) => boolean, initialVisibility: boolean = false) {
        this.visible = ko.observable(initialVisibility);
    }

    toggle() {
        this.visible(!this.visible());
        this.updated.notifySubscribers();
    }

    get enabled() {
        return this.enabledHandler(this.content);
    }
}

declare type InputPanelData = {

    title: string,
    columnsTitle: string,
    columns: IColumn[],
    expressionTitle: string,
    expressions: string[],
    hasColumns: boolean,
    hasExpressions: boolean
}

declare type InputPanelJoinConfig = { id: ColumnUsageType, title: string, columnsTitle?: string, expressionTitle?: string };

const outputPanelConfig = {};

const inputPanelConfig: {

    joins: InputPanelJoinConfig[]
} = {

    joins: [
        { id: "predicate", title: "Predicate" },
        { id: "set_predicate", title: "Set Predicate" },
        { id: "join_inside", title: "Inner Side Columns" },
        { id: "join_outside", title: "Outer Side Columns" },
        { id: "residual", title: "Residual" },
        { id: "passthru", title: "Pass-Thru" },
        { id: "partition", title: "Partition" },
        { id: "action", title: "Action Column" },
        { id: "segment", title: "Segment Column" },
        { id: "probe", title: "Probe Column" },
        { id: "udx", title: "UDX Columns" },
        { id: "outer_references", title: "Outer References" },
        { id: "hashkeys", title: "Hash Keys" },
        { id: "build_hash", title: "Build", columnsTitle: "Hash Keys", expressionTitle: "Residual" },
        { id: "probe_hash", title: "Probe", columnsTitle: "Hash Keys", expressionTitle: "Residual" },
    ]
};
