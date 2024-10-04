import { ColumnReferenceType, ObjectType, OrderByType, OrderByTypeOrderByColumn, ColumnReferenceListType, ScalarType, SeekPredicateType } from "./saxfactory";
import { getOrAdd } from "./core";
import { formatScalar, formatCompareOp } from "./saxformat";
import { StringBuilder } from "../common/stringBuilder";
import { ScanRangeType } from "sqlplan/saxfactory";


export interface ITableObject {
    Table?: string;
}

export declare type ColumnUsageType =
    "action" |
    "defined_value" |
    "fragment_id" |
    "groupby" |
    "hashkeys" |
    "join_hashkeys_build" |
    "join_hashkeys_probe" |
    "join_inside" |
    "join_outer_reference" |
    "join_outer" |
    "join_outside" |
    "orderby" |
    "original_action" |
    "output" |
    "parameter" |
    "partition" |
    "predicate" |
    "probe" |
    "range" |
    "scalar_item" |
    "seek_predicate" |
    "set_predicate" |
    "segment" |
    "tie" |
    "udx" |
    "warning_no_statistics" |
    "build_hash" |
    "probe_hash" |
    "predicate" |
    "passthru" |
    "outer_references" |
    "residual" |
    "pass_through"
    ;

export declare type TableUsageType =
    "guessed_selectivity_spatial" |
    "indexed_view" |
    "parallelism_activation" |
    "parallelism_brick_routing" |
    "parameterization" |
    "rowset" |
    "tablevaluefunction" |
    "ud_aggregate"
    ;


export declare type ColumnInfo = { title: string; columns: string[] };

export interface IColumn {
    columnName: string;
    displayName: string;
    formattedName: string;
    usedBy(usageType: ColumnUsageType): boolean;
    ascending: string;
    fullName: string;
}

export class DataInfo {

    objects: ObjectType[] = [];
    get rowSetObject() {
        if (this.objects && this.objects.length > 0) {
            return this.objects[0];
        }
    }
    defaultServer: Server = new Server();
    servers: { [name: string]: Server } = {};
    // tableVars: { [name: string]: Table } = {};
    // tempTables: { [name: string]: Table } = {};

    private allTables: Table[] = [];

    private columnSets: { [name: string]: IColumn[] } = {};

    expressions: { [name: string]: ScalarType } = {};

    seekPredicateSet: SeekPredicateSet = {
        prefixSet: [],
        isNotNullSet: [],
        startRangeSet: [],
        endRangeSet: []
    };
    partitionSeekPredicates: SeekPredicateSet[] = [];

    getColumns(usage?: ColumnUsageType, sort?: boolean) {
        let ret: IColumn[] = [];

        if (usage) {
            const columnSet = this.columnSets[usage];
            if (columnSet) {
                ret = ret.concat(columnSet);
            }
        } else {

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

    addObjects(usageType: TableUsageType, objects: ObjectType[]) {
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

    addColumns(usageType: ColumnUsageType, columns?: ColumnReferenceListType): DataInfo {

        if (!columns) {
            return this;
        }

        for (const columnRef of columns) {
            const column = this.getColumn(columnRef).addUsage(usageType);
            const columns = getOrAdd(this.columnSets, usageType, () => []);
            columns.push(column);

            if (columnRef.ScalarOperator) {
                const dcolumns = getOrAdd(this.columnSets, "defined_value", () => []);
                dcolumns.push(column.addDefinition(formatScalar(this, columnRef.ScalarOperator))
                    .addUsage("defined_value"));
            }
        }

        return this;
    }

    addOrderByColumns(columns?: OrderByTypeOrderByColumn[]) {
        const ret: Column[] = [];
        if (!columns) {
            return ret;
        }

        for (const orderColumn of columns) {
            const column = this.getColumn(orderColumn.ColumnReference)
                .addUsage("orderby")
                .addOrderByDirection(!!orderColumn.Ascending);
            const columns = getOrAdd(this.columnSets, "orderby", () => []);
            columns.push(column);
            ret.push(column);
        }
        return ret;
    }

    addDefinedColumn(column: ColumnReferenceType, value: ScalarType, description?: string): any {

        const col =
            this.getColumn(column)
                .addUsage("defined_value")
                .addDefinition(formatScalar(this, value))
                .addDescription(description);

        const columns = getOrAdd(this.columnSets, "defined_value", () => []);
        columns.push(col);
        return this;
    }

    addScalarExpression(usage: ColumnUsageType, expression: ScalarType) {
        this.expressions[usage] = expression;
    }

    addSeekPredicate(usage: ColumnUsageType, seekPredicate: SeekPredicateType, partitionIndex?: number) {
        if (partitionIndex === undefined) {
            this.addSeekPredicateItem(this.seekPredicateSet, seekPredicate);
        } else {
            this.partitionSeekPredicates[partitionIndex] = this.addSeekPredicateItem(this.partitionSeekPredicates[partitionIndex], seekPredicate);
        }
    }

    addSeekPredicateItem(set: SeekPredicateSet, seekPredicate: SeekPredicateType) {
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

    formatSeekType(rangeSet: Array<((sep: string) => string)>, scanRange?: ScanRangeType) {
        if (!scanRange || !scanRange.RangeColumns || scanRange.RangeColumns.length === 0 || !scanRange.RangeExpressions || scanRange.RangeExpressions.length === 0 || scanRange.RangeColumns.length !== scanRange.RangeExpressions.length) {
            return;
        }

        for (let index = 0; index < scanRange.RangeColumns.length; index++) {
            const column = this.getColumn(scanRange.RangeColumns[index]);
            const expression = scanRange.RangeExpressions[index];

            const prs = new StringBuilder();
            prs.append(() => column.displayName);
            prs.append(formatCompareOp(scanRange.ScanType));
            prs.append(formatScalar(this, expression));
            rangeSet.push(prs.format.bind(prs));
        }
    }

    getColumn(columnRef?: ColumnReferenceType) {
        if (!columnRef || !columnRef.Column) {
            throw new Error("Not a column");
        }

        const server = (columnRef.Server) ? getOrAdd(this.servers, columnRef.Server, (n: string) => { return new Server(n) }) : this.defaultServer;
        const database = (columnRef.Database) ? getOrAdd(server.databases, columnRef.Database, (n: string) => { return new Database(n) }) : server.defaultDatabase;
        const schema = (columnRef.Schema) ? getOrAdd(database.schemas, columnRef.Schema, (n: string) => { return new Schema(n) }) : database.defaultSchema;
        const table = (columnRef.Table) ? getOrAdd(schema.tables, columnRef.Table, (n: string) => {
            return new Table(server.name, database.name, schema.name, n,
                () => propertyCount(this.servers),
                () => propertyCount(server.databases),
                () => propertyCount(database.schemas))
        }) : schema.defaultTable;
        const column = getOrAdd(table.columns, columnRef.Column, (n: string) => {

            const c =
                new Column(columnRef,
                    () => propertyCount(this.servers),
                    () => propertyCount(server.databases),
                    () => propertyCount(database.schemas),
                    () => propertyCount(schema.tables));
            server.allColumns.push(c);

            return c;
        });
        return column;
    }

    getTable(object?: ObjectType) {
        if (!object || !object.Table) return;

        const server = (object.Server) ? getOrAdd(this.servers, object.Server, (n: string) => { return new Server(n) }) : this.defaultServer;
        const database = (object.Database) ? getOrAdd(server.databases, object.Database, (n: string) => { return new Database(n) }) : server.defaultDatabase;
        const schema = (object.Schema) ? getOrAdd(database.schemas, object.Schema, (n: string) => { return new Schema(n) }) : database.defaultSchema;
        return getOrAdd(schema.tables, object.Table, (n: string) => {
            return new Table(server.name, database.name, schema.name, n,
                () => propertyCount(this.servers),
                () => propertyCount(server.databases),
                () => propertyCount(database.schemas))
        });
    }

    getColumnId(column?: ColumnReferenceType) {
        if (!column) {
            return null;
        }
        const empty = "[]";
        const parts: string[] = [
            column.Server ? column.Server : empty,
            column.Database ? column.Database : empty,
            column.Table ? column.Table : empty,
            column.Column ? column.Column : empty
        ];
        return parts.join(".")
    }
}



export class Server {
    defaultDatabase: Database = new Database();
    databases: { [name: string]: Database } = {};
    allColumns: IColumn[] = [];
    constructor(public name: string = "") {
    }
}
export class Database {
    defaultSchema: Schema = new Schema();
    schemas: { [name: string]: Schema } = {};
    constructor(public name: string = "") {
    }
}
export class Schema {
    defaultTable: Table = new Table("", "", "", "", () => 0, () => 0, () => 0);
    tables: { [name: string]: Table } = {};
    constructor(public name: string = "") {
    }
}

export class Table {
    columns: { [name: string]: Column } = {};
    constructor(
        public server: string,
        public database: string,
        public schema: string,
        public name: string = "",
        private serverCount: () => number,
        private databaseCount: () => number,
        private schemaCount: () => number) {
    }

    get displayName() {

        const parts: string[] = [];

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

export class Column implements IColumn {


    usage: { [name: string]: boolean } = {};
    definition?: () => string;
    description?: string;
    ascending: string = "ASC";

    constructor(
        private columnRef: ColumnReferenceType,
        private serverCount: () => number,
        private databaseCount: () => number,
        private schemaCount: () => number,
        private tableCount: () => number
    ) {

    }

    addUsage(usageType: ColumnUsageType) {
        this.usage[usageType] = true;
        return this;
    }
    addDefinition(definition: () => string) {
        this.definition = definition;
        return this;
    }
    addDescription(description?: string) {
        if (description != undefined) {
            this.description = description;
        }
        return this;
    }
    addOrderByDirection(ascending: boolean) {
        this.ascending = ascending ? "ASC" : "DESC";
        return this;
    }


    usedBy(usageType: ColumnUsageType) {
        return !!this.usage[usageType];
    }

    get columnName() {
        return <string>this.columnRef.Column;
    }

    get displayName() {

        const parts: string[] = [];

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

    get fullName(){
        const parts: string[] = [];

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

export declare type SeekPredicateSet = {
    prefixSet: Array<((sep: string) => string)>,
    isNotNullSet: Array<((sep: string) => string)>,
    startRangeSet: Array<((sep: string) => string)>,
    endRangeSet: Array<((sep: string) => string)>
}



function formatMultipartName(name: string | string[]) {
    if (!name) return "";
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


function isTempTable(table?: string | ITableObject) {
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

function isTableVariable(table?: string | ITableObject) {
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

function isSchemaTable(table?: string | ITableObject) {
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

function propertyCount(object: any) {
    if (!object) {
        return 0;
    }
    return Object.keys(object).length;
}

