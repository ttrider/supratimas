"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortedSet_1 = require("../common/sortedSet");
class AppStorage {
    constructor() {
        this.serverSet = new sortedSet_1.SortedSet((a) => { return a.name; });
        this.tableVars = new sortedSet_1.SortedSet((a) => { return a.name; });
        this.tempTables = new sortedSet_1.SortedSet((a) => { return a.name; });
        this.nodes = [];
    }
    add(node) {
        if (!node.node.dataInfo.objects)
            return;
        for (let target of node.node.dataInfo.objects) {
            this.addTarget(node, target, node.node.dataInfo.getColumns(undefined, true));
        }
    }
    addTarget(node, target, columns) {
        if (!target)
            return;
        var server = target.Server ? target.Server : "";
        var database = target.Database ? target.Database : "";
        var schema = target.Schema ? target.Schema : "";
        if (target.Table) {
            let tb;
            const nodeInfo = new Node(node, columns);
            this.nodes.push(nodeInfo);
            if (target.Table.match(/\s*\[?\s*@/)) {
                tb = this.tableVars.getOrAdd(target.Table, (n) => new Table(n));
            }
            else if (target.Table.match(/\s*\[?\s*#/)) {
                tb = this.tempTables.getOrAdd(target.Table, (n) => new Table(n));
            }
            else {
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
exports.AppStorage = AppStorage;
class Server {
    constructor(name) {
        this.name = name;
        this.dbSet = new sortedSet_1.SortedSet((a) => { return a.name; });
    }
}
class Database {
    constructor(name, server) {
        this.name = name;
        this.server = server;
        this.tableSet = new sortedSet_1.SortedSet((a) => { return a.name; });
        this.schemaSet = new sortedSet_1.SortedSet((a) => { return a.name; });
        this.title = (server) ? server + "." + name : name;
    }
}
class Schema {
    constructor(name) {
        this.name = name;
        this.tableSet = new sortedSet_1.SortedSet((a) => { return a.name; });
    }
}
class Table {
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
        this.indexSet = new sortedSet_1.SortedSet((a) => { return a.name; });
        this.nodes = [];
        this.title = (schema) ? schema + "." + name : name;
        this.pk = null;
    }
}
class Index {
    constructor(name, kind) {
        this.name = name;
        this.kind = kind;
        this.nodes = [];
    }
}
class Node {
    constructor(node, columns) {
        this.node = node;
        this.columns = columns;
        this.visible = ko.observable(true);
        if (!this.columns) {
            this.columns = [];
        }
    }
    get nodeId() {
        return this.node.node.nodeId;
    }
    get iconTemplate() {
        return this.node.iconTemplate;
    }
    get formattedCost() {
        return this.node.formattedCost;
    }
    get title() {
        return this.node.nameSet.items[0].originalValue;
    }
}
exports.Node = Node;
//# sourceMappingURL=storage.js.map