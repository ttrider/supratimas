"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const saxformat_1 = require("./saxformat");
const stringBuilder_1 = require("../common/stringBuilder");
class DataInfo {
    constructor() {
        this.objects = [];
        this.defaultServer = new Server();
        this.servers = {};
        // tableVars: { [name: string]: Table } = {};
        // tempTables: { [name: string]: Table } = {};
        this.allTables = [];
        this.columnSets = {};
        this.expressions = {};
        this.seekPredicateSet = {
            prefixSet: [],
            isNotNullSet: [],
            startRangeSet: [],
            endRangeSet: []
        };
        this.partitionSeekPredicates = [];
    }
    get rowSetObject() {
        if (this.objects && this.objects.length > 0) {
            return this.objects[0];
        }
    }
    getColumns(usage, sort) {
        let ret = [];
        if (usage) {
            const columnSet = this.columnSets[usage];
            if (columnSet) {
                ret = ret.concat(columnSet);
            }
        }
        else {
            ret = ret.concat(this.defaultServer.allColumns);
            for (const sk in this.servers) {
                if (this.servers.hasOwnProperty(sk)) {
                    const server = this.servers[sk];
                    ret = ret.concat(server.allColumns);
                }
            }
        }
        if (sort) {
            return ret.sort((f, s) => { return (f.displayName < s.displayName) ? -1 : 1; });
        }
        return ret;
    }
    addObjects(usageType, objects) {
        for (const object of objects) {
            const tb = this.getTable(object);
            if (tb) {
                this.allTables.push(tb);
            }
            if (usageType === "rowset") {
                this.objects.push(object);
            }
        }
        return this;
    }
    addColumns(usageType, columns) {
        if (!columns) {
            return this;
        }
        for (const columnRef of columns) {
            const column = this.getColumn(columnRef).addUsage(usageType);
            const columns = core_1.getOrAdd(this.columnSets, usageType, () => []);
            columns.push(column);
            if (columnRef.ScalarOperator) {
                const dcolumns = core_1.getOrAdd(this.columnSets, "defined_value", () => []);
                dcolumns.push(column.addDefinition(saxformat_1.formatScalar(this, columnRef.ScalarOperator))
                    .addUsage("defined_value"));
            }
        }
        return this;
    }
    addOrderByColumns(columns) {
        const ret = [];
        if (!columns) {
            return ret;
        }
        for (const orderColumn of columns) {
            const column = this.getColumn(orderColumn.ColumnReference)
                .addUsage("orderby")
                .addOrderByDirection(!!orderColumn.Ascending);
            const columns = core_1.getOrAdd(this.columnSets, "orderby", () => []);
            columns.push(column);
            ret.push(column);
        }
        return ret;
    }
    addDefinedColumn(column, value, description) {
        const col = this.getColumn(column)
            .addUsage("defined_value")
            .addDefinition(saxformat_1.formatScalar(this, value))
            .addDescription(description);
        const columns = core_1.getOrAdd(this.columnSets, "defined_value", () => []);
        columns.push(col);
        return this;
    }
    addScalarExpression(usage, expression) {
        this.expressions[usage] = expression;
    }
    addSeekPredicate(usage, seekPredicate, partitionIndex) {
        if (partitionIndex === undefined) {
            this.addSeekPredicateItem(this.seekPredicateSet, seekPredicate);
        }
        else {
            this.partitionSeekPredicates[partitionIndex] = this.addSeekPredicateItem(this.partitionSeekPredicates[partitionIndex], seekPredicate);
        }
    }
    addSeekPredicateItem(set, seekPredicate) {
        if (!set) {
            set = {
                prefixSet: [],
                isNotNullSet: [],
                startRangeSet: [],
                endRangeSet: []
            };
        }
        if (seekPredicate.IsNotNull && seekPredicate.IsNotNull.ColumnReference) {
            const isnc = this.getColumn(seekPredicate.IsNotNull.ColumnReference);
            set.isNotNullSet.push(() => isnc.displayName);
        }
        this.formatSeekType(set.prefixSet, seekPredicate.Prefix);
        this.formatSeekType(set.startRangeSet, seekPredicate.StartRange);
        this.formatSeekType(set.endRangeSet, seekPredicate.EndRange);
        return set;
    }
    formatSeekType(rangeSet, scanRange) {
        if (!scanRange || !scanRange.RangeColumns || scanRange.RangeColumns.length === 0 || !scanRange.RangeExpressions || scanRange.RangeExpressions.length === 0 || scanRange.RangeColumns.length !== scanRange.RangeExpressions.length) {
            return;
        }
        for (let index = 0; index < scanRange.RangeColumns.length; index++) {
            const column = this.getColumn(scanRange.RangeColumns[index]);
            const expression = scanRange.RangeExpressions[index];
            const prs = new stringBuilder_1.StringBuilder();
            prs.append(() => column.displayName);
            prs.append(saxformat_1.formatCompareOp(scanRange.ScanType));
            prs.append(saxformat_1.formatScalar(this, expression));
            rangeSet.push(prs.format.bind(prs));
        }
    }
    getColumn(columnRef) {
        if (!columnRef || !columnRef.Column) {
            throw new Error("Not a column");
        }
        const server = (columnRef.Server) ? core_1.getOrAdd(this.servers, columnRef.Server, (n) => { return new Server(n); }) : this.defaultServer;
        const database = (columnRef.Database) ? core_1.getOrAdd(server.databases, columnRef.Database, (n) => { return new Database(n); }) : server.defaultDatabase;
        const schema = (columnRef.Schema) ? core_1.getOrAdd(database.schemas, columnRef.Schema, (n) => { return new Schema(n); }) : database.defaultSchema;
        const table = (columnRef.Table) ? core_1.getOrAdd(schema.tables, columnRef.Table, (n) => {
            return new Table(server.name, database.name, schema.name, n, () => propertyCount(this.servers), () => propertyCount(server.databases), () => propertyCount(database.schemas));
        }) : schema.defaultTable;
        const column = core_1.getOrAdd(table.columns, columnRef.Column, (n) => {
            const c = new Column(columnRef, () => propertyCount(this.servers), () => propertyCount(server.databases), () => propertyCount(database.schemas), () => propertyCount(schema.tables));
            server.allColumns.push(c);
            return c;
        });
        return column;
    }
    getTable(object) {
        if (!object || !object.Table)
            return;
        const server = (object.Server) ? core_1.getOrAdd(this.servers, object.Server, (n) => { return new Server(n); }) : this.defaultServer;
        const database = (object.Database) ? core_1.getOrAdd(server.databases, object.Database, (n) => { return new Database(n); }) : server.defaultDatabase;
        const schema = (object.Schema) ? core_1.getOrAdd(database.schemas, object.Schema, (n) => { return new Schema(n); }) : database.defaultSchema;
        return core_1.getOrAdd(schema.tables, object.Table, (n) => {
            return new Table(server.name, database.name, schema.name, n, () => propertyCount(this.servers), () => propertyCount(server.databases), () => propertyCount(database.schemas));
        });
    }
    getColumnId(column) {
        if (!column) {
            return null;
        }
        const empty = "[]";
        const parts = [
            column.Server ? column.Server : empty,
            column.Database ? column.Database : empty,
            column.Table ? column.Table : empty,
            column.Column ? column.Column : empty
        ];
        return parts.join(".");
    }
}
exports.DataInfo = DataInfo;
class Server {
    constructor(name = "") {
        this.name = name;
        this.defaultDatabase = new Database();
        this.databases = {};
        this.allColumns = [];
    }
}
exports.Server = Server;
class Database {
    constructor(name = "") {
        this.name = name;
        this.defaultSchema = new Schema();
        this.schemas = {};
    }
}
exports.Database = Database;
class Schema {
    constructor(name = "") {
        this.name = name;
        this.defaultTable = new Table("", "", "", "", () => 0, () => 0, () => 0);
        this.tables = {};
    }
}
exports.Schema = Schema;
class Table {
    constructor(server, database, schema, name = "", serverCount, databaseCount, schemaCount) {
        this.server = server;
        this.database = database;
        this.schema = schema;
        this.name = name;
        this.serverCount = serverCount;
        this.databaseCount = databaseCount;
        this.schemaCount = schemaCount;
        this.columns = {};
    }
    get displayName() {
        const parts = [];
        if (this.server && this.serverCount() > 1) {
            parts.push(this.server);
        }
        if (this.database && this.databaseCount() > 1) {
            parts.push(this.database);
        }
        if (this.schema && this.schemaCount() > 1) {
            parts.push(this.schema);
        }
        parts.push(this.name);
        return formatMultipartName(parts);
    }
}
exports.Table = Table;
class Column {
    constructor(columnRef, serverCount, databaseCount, schemaCount, tableCount) {
        this.columnRef = columnRef;
        this.serverCount = serverCount;
        this.databaseCount = databaseCount;
        this.schemaCount = schemaCount;
        this.tableCount = tableCount;
        this.usage = {};
        this.ascending = "ASC";
    }
    addUsage(usageType) {
        this.usage[usageType] = true;
        return this;
    }
    addDefinition(definition) {
        this.definition = definition;
        return this;
    }
    addDescription(description) {
        if (description != undefined) {
            this.description = description;
        }
        return this;
    }
    addOrderByDirection(ascending) {
        this.ascending = ascending ? "ASC" : "DESC";
        return this;
    }
    usedBy(usageType) {
        return !!this.usage[usageType];
    }
    get columnName() {
        return this.columnRef.Column;
    }
    get displayName() {
        const parts = [];
        if (this.columnRef.Server && this.serverCount() > 1) {
            parts.push(this.columnRef.Server);
        }
        if (this.columnRef.Database && this.databaseCount() > 1) {
            parts.push(this.columnRef.Database);
        }
        if (this.columnRef.Schema && this.schemaCount() > 1) {
            parts.push(this.columnRef.Schema);
        }
        if (this.columnRef.Table && this.tableCount() > 1) {
            parts.push(this.columnRef.Table);
        }
        if (this.columnRef.Column) {
            parts.push(this.columnRef.Column);
        }
        return formatMultipartName(parts);
    }
    get formattedName() {
        let ret = this.displayName;
        if (this.definition) {
            ret += " = " + this.definition();
        }
        if (this.description) {
            ret += ` (${this.description})`;
        }
        return ret;
    }
    get fullName() {
        const parts = [];
        if (this.columnRef.Server) {
            parts.push(this.columnRef.Server);
        }
        if (this.columnRef.Database) {
            parts.push(this.columnRef.Database);
        }
        if (this.columnRef.Schema) {
            parts.push(this.columnRef.Schema);
        }
        if (this.columnRef.Table) {
            parts.push(this.columnRef.Table);
        }
        if (this.columnRef.Column) {
            parts.push(this.columnRef.Column);
        }
        return formatMultipartName(parts);
    }
}
exports.Column = Column;
function formatMultipartName(name) {
    if (!name)
        return "";
    if (Array.isArray(name)) {
        for (let i = 0; i < name.length; i++) {
            name[i] = formatMultipartName(name[i]);
        }
        return name.join(".");
    }
    if (name[0] !== "@") {
        if (name[0] !== "[") {
            name = "[" + name;
        }
        if (name[name.length - 1] !== "]") {
            name = name + "]";
        }
    }
    return name;
}
function isTempTable(table) {
    if (!table) {
        return false;
    }
    if (typeof table !== "string") {
        table = table.Table;
        if (!table) {
            return false;
        }
    }
    return table.match(/\s*\[?\s*#/);
}
function isTableVariable(table) {
    if (!table) {
        return false;
    }
    if (typeof table !== "string") {
        table = table.Table;
        if (!table) {
            return false;
        }
    }
    return table.match(/\s*\[?\s*@/);
}
function isSchemaTable(table) {
    if (!table) {
        return false;
    }
    if (typeof table !== "string") {
        table = table.Table;
        if (!table) {
            return false;
        }
    }
    return !(table.match(/\s*\[?\s*@/) || table.match(/\s*\[?\s*@/));
}
function propertyCount(object) {
    if (!object) {
        return 0;
    }
    return Object.keys(object).length;
}
//# sourceMappingURL=dataInfo.js.map