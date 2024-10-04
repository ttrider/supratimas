import { SortedSet } from "../common/sortedSet";
import * as formatter from "../sqlplan/formatter";
import { AppNodeBase } from "./node";
import { ObjectType, ColumnReferenceType } from "../sqlplan/saxfactory";
import { IColumn } from "../sqlplan/dataInfo";

export class AppStorage {
    private serverSet = new SortedSet<Server>((a) => { return a.name; });
    private tableVars = new SortedSet<Table>((a) => { return a.name; });
    private tempTables = new SortedSet<Table>((a) => { return a.name; });

    nodes: Node[] = [];

    add(node: AppNodeBase) {
        if (!node.node.dataInfo.objects) return;

        for (let target of node.node.dataInfo.objects) {
            this.addTarget(node, target, node.node.dataInfo.getColumns(undefined, true));
        }
    }

    private addTarget(node: AppNodeBase, target: ObjectType, columns: Array<IColumn>) {
        if (!target) return;

        var server = target.Server ? target.Server : "";
        var database = target.Database ? target.Database : "";
        var schema = target.Schema ? target.Schema : "";

        if (target.Table) {

            let tb: Table;
            const nodeInfo = new Node(node, columns);
            this.nodes.push(nodeInfo);

            if (target.Table.match(/\s*\[?\s*@/)) {
                tb = this.tableVars.getOrAdd(target.Table, (n) => new Table(n));
            } else if (target.Table.match(/\s*\[?\s*#/)) {
                tb = this.tempTables.getOrAdd(target.Table, (n) => new Table(n));
            } else {

                var server = target.Server ? target.Server : "";
                var database = target.Database ? target.Database : "";
                var schema = target.Schema ? target.Schema : "";

                var s = this.serverSet.getOrAdd(server, (n) => new Server(n));
                var db = s.dbSet.getOrAdd(database, (n) => new Database(n, server));
                var sch = db.schemaSet.getOrAdd(schema, (n) => new Schema(n));

                tb = sch.tableSet.getOrAdd(target.Table, (n) => new Table(n, schema));
            }

            if (tb) {
                if (target.Index) {
                    let ix = new Index(target.Index, target.IndexKind);

                    if (target.IndexKind === "Clustered") {
                        if (!tb.pk) {
                            tb.pk = ix;
                        }
                        else {
                            ix = tb.pk;
                        }
                    }
                    else {
                        ix = tb.indexSet.getOrAdd(target.Index, (n) => ix);
                    }

                    ix.nodes.push(nodeInfo);
                }
                else {
                    tb.nodes.push(nodeInfo);
                }
            }
        }
    }


}

class Server {
    dbSet = new SortedSet<Database>((a) => { return a.name; });

    constructor(public name: string) { }
}

class Database {
    tableSet = new SortedSet<Table>((a) => { return a.name; });
    schemaSet = new SortedSet<Schema>((a) => { return a.name; });
    title: string;

    constructor(public name: string, public server: string) {

        this.title = (server) ? server + "." + name : name;
    }
}

class Schema {
    tableSet = new SortedSet<Table>((a) => { return a.name; });
    constructor(public name: string) { }
}

class Table {
    indexSet = new SortedSet<Index>((a) => { return a.name; });
    pk: Index | null;
    title: string;
    nodes: Array<Node> = [];

    constructor(public name: string, public schema?: string) {

        this.title = (schema) ? schema + "." + name : name;
        this.pk = null;
    }
}

class Index {

    nodes: Array<Node> = [];

    constructor(public name: string, public kind: string) { }
}

export class Node {

    get nodeId(): number {
        return this.node.node.nodeId;
    }
    get iconTemplate() {
        return this.node.iconTemplate;
    }
    get formattedCost(): string {
        return this.node.formattedCost;
    }
    get title() {
        return this.node.nameSet.items[0].originalValue;
    }

    visible: KnockoutObservable<boolean> = ko.observable(true);

    constructor(public node: AppNodeBase, public columns: Array<IColumn>) {
        if (!this.columns) {
            this.columns = [];
        }
    }
}

