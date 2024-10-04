"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatter_1 = require("../sqlplan/formatter");
const stringCollection_1 = require("../common/stringCollection");
const saxformat_1 = require("../sqlplan/saxformat");
const normalNameLength = 25;
const maxNameLength = 80;
function createNode(statement, planNode, parentNode) {
    return new AppNode(statement, planNode, parentNode);
}
exports.createNode = createNode;
function createStatementNode(statement) {
    return new AppStatementNode(statement);
}
exports.createStatementNode = createStatementNode;
class AppNodeBase {
    constructor(statement, node, selected, parent) {
        this.statement = statement;
        this.node = node;
        this.children = [];
        this.showOutputColumns = ko.observable(false);
        this.showInputColumns = ko.observable(false);
        this.selectable = false;
        this.attachedNodes = [];
        this.row = 0;
        this.column = 0;
        this.statistics = [];
        this.updated = new ko.subscribable();
        this.nodeId = "Node" + node.nodeId;
        this.parent = parent;
        if (selected === undefined) {
            this.selected = ko.observable(false);
            this.selectable = false;
        }
        else {
            this.selected = selected;
            this.selectable = true;
        }
        const init = this.initialize();
        this.nameSet = new stringCollection_1.StringCollection(init.nameSet, normalNameLength, maxNameLength);
        this.nameSet.updated.subscribe((element) => this.updated.notifySubscribers(element));
        this.statistics = init.statistics;
        this.inputPanelData = this.createInputPanelData();
        this.metrics = new Section(node.metrics.metrics, this.updated, (item) => item.length > 0);
        this.warnings = new Section(this.node.warnings, this.updated, (item) => item.length > 0);
    }
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
    get isCostly() {
        return this.node.metrics.isCostly;
    }
    get formattedCost() {
        return "";
    }
    get columnsInfo() {
        const di = this.node.dataInfo;
        if (this.columnInfoSet === undefined) {
            const ret = [];
            addColumnInfo(ret, "Defined Values", "defined_value", (i) => i.formattedName, true, c => !c.usedBy("output"));
            addColumnInfo(ret, "Output", "output", (i) => i.formattedName, true);
            addColumnInfo(ret, "Group By", "groupby", (i) => i.displayName);
            addColumnInfo(ret, "Order By", "orderby", (i) => i.displayName + " " + i.ascending);
            this.columnInfoSet = ret;
        }
        return this.columnInfoSet;
        function addColumnInfo(ret, title, key, formatter, sort, filter) {
            let columnSet = di.getColumns(key, sort);
            if (filter) {
                columnSet = columnSet.filter(filter);
            }
            if (columnSet.length > 0) {
                ret.push({
                    title: title,
                    columns: columnSet.reduce((ret, item, index, array) => {
                        ret.push(formatter(item));
                        return ret;
                    }, [])
                });
            }
            return ret;
        }
    }
    createInputPanelData() {
        const di = this.node.dataInfo;
        const ret = [];
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
        function getJoinSet(config) {
            const expressions = [];
            if (di.expressions[config.id]) {
                const formattedExpression = saxformat_1.formatScalar(di, di.expressions[config.id])();
                const formattedParts = formattedExpression.split(";\n");
                for (const part of formattedParts) {
                    expressions.push(part);
                }
            }
            const columns = di.getColumns(config.id);
            const ret = {
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
        function formatSeekPredicateItems(title, items) {
            if (items && items.length > 0) {
                const expressions = [];
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
        function formatSeekPredicateSet(sps, index) {
            if (!sps)
                return;
            const tp = index != undefined ? "Part #" + (index + 1) + " " : "";
            let seekItems = formatSeekPredicateItems(tp + "Seek Prefix", sps.prefixSet);
            if (seekItems) {
                ret.push(seekItems);
            }
            seekItems = formatSeekPredicateItems(tp + "Seek Is Not NULL", sps.isNotNullSet);
            if (seekItems) {
                ret.push(seekItems);
            }
            seekItems = formatSeekPredicateItems(tp + "Seek Start Range", sps.startRangeSet);
            if (seekItems) {
                ret.push(seekItems);
            }
            seekItems = formatSeekPredicateItems(tp + "Seek End Range", sps.endRangeSet);
            if (seekItems) {
                ret.push(seekItems);
            }
        }
    }
    initialize() {
        return {
            nameSet: [],
            statistics: []
        };
    }
    calculateMatrix(column, row) {
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
        return { maxColumn: maxColumn, maxRow: maxRow };
    }
    applyMatrix(maxColumn) {
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
AppNodeBase.lastNodeId = 1;
exports.AppNodeBase = AppNodeBase;
class AppNode extends AppNodeBase {
    get formattedDataSize() {
        return formatter_1.formatByteSize(this.node.metrics.actualDataSize);
    }
    get formattedRecords() {
        let ret = this.node.metrics.actualRowCount.toString();
        const est = this.estimatedRows;
        if (est) {
            ret += `(${est})`;
        }
        return ret;
    }
    get formattedSubtreeCost() {
        return formatter_1.formatPercentage(this.node.metrics.relativeSubtreeCost * this.statement.selectedStatementCost());
    }
    get formattedCost() {
        return formatter_1.formatPercentage(this.node.metrics.relativeCost * this.statement.selectedStatementCost());
    }
    initialize() {
        const { tableName, indexName } = this.getFormattedTableName(this.node);
        let nameSet = [];
        for (const nameItem of this.node.nameSet) {
            if (typeof nameItem === "function") {
                nameSet.push(nameItem());
            }
            else {
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
    getFormattedTableName(node) {
        const t = node.dataInfo.rowSetObject;
        if (t) {
            return { tableName: t.Table, indexName: t.Index };
        }
        return { tableName: "", indexName: "" };
    }
    constructor(statement, node, parent) {
        super(statement, node, undefined, parent);
        this.flags = node.flags.join(", ");
    }
}
exports.AppNode = AppNode;
class AppStatementNode extends AppNodeBase {
    constructor(statement) {
        super(statement, statement.statementNode, statement.selected);
        this.statement = statement;
        this.select = statement.select.bind(statement);
        this.toggle = statement.toggle.bind(statement);
    }
    get queryText() {
        return this.statement.queryText;
    }
    get formattedCost() {
        return formatter_1.formatPercentage(this.statement.relativeStatementCost());
    }
    get cost() {
        return this.node.metrics.relativeCost;
    }
    get formattedSubtreeCost() {
        return formatter_1.formatPercentage(this.statement.selectedStatementCost());
    }
    initialize() {
        return {
            nameSet: [this.statement.statementText],
            statistics: []
        };
    }
}
exports.AppStatementNode = AppStatementNode;
class Section {
    constructor(content, updated, enabledHandler, initialVisibility = false) {
        this.content = content;
        this.updated = updated;
        this.enabledHandler = enabledHandler;
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
exports.Section = Section;
const outputPanelConfig = {};
const inputPanelConfig = {
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
//# sourceMappingURL=node.js.map