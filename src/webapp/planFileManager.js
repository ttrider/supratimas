"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const planFile_1 = require("./planFile");
const localStoragePrefix = "plan.file.";
class PlanFileManager {
    constructor() {
        this.planFiles = ko.observableArray((() => {
            const ret = [];
            for (const planFileInfo of this.getPlanFiles()) {
                ret.push(new planFile_1.PlanFile().initialize(planFileInfo.meta));
            }
            ret.sort(this.sortFunction);
            return ret;
        })());
        window.addEventListener("storage", e => {
            if (!e.key) {
                this.planFiles.removeAll();
            }
            else if (this.isPlanFile(e.key)) {
                const item = this.lookupFile(e.key);
                if (item) {
                    if (e.newValue) {
                        const newItem = new planFile_1.PlanFile().initialize((e.newValue).meta);
                        this.planFiles.replace(item, newItem);
                    }
                    else {
                        this.planFiles.remove(item);
                    }
                }
            }
            else {
                return;
            }
            this.planFiles.sort(this.sortFunction);
        });
    }
    sortFunction(left, right) {
        return left.name.localeCompare(right.name);
    }
    lookupFile(id) {
        if (!id) {
            return null;
        }
        for (const item of this.planFiles()) {
            if (item.id === id) {
                return item;
            }
        }
        return null;
    }
    createFromFile(file, cb) {
        const pf = new planFile_1.PlanFile();
        pf.name = file.name;
        pf.size = file.size;
        pf.lastModified = new Date(file.lastModified);
        var reader = new FileReader();
        reader.addEventListener("load", (e) => {
            if (e.target.error) {
                cb(e.target.error, pf);
            }
            else {
                try {
                    pf.initialize(undefined, e.currentTarget.result);
                    this.savePlanFile(pf.id, JSON.stringify(pf.properties), e.currentTarget.result, e => {
                        cb(e, pf);
                    });
                }
                catch (err) {
                    cb(err, pf);
                }
            }
        });
        reader.readAsText(file);
        return pf;
    }
    createFromClipboard(data, cb) {
        const pf = new planFile_1.PlanFile();
        pf.name = "pasted from " + (new Date().toDateString());
        pf.size = data.length;
        pf.lastModified = new Date();
        try {
            pf.initialize(undefined, data);
            this.savePlanFile(pf.id, JSON.stringify(pf.properties), data, e => {
                cb(e, pf);
            });
        }
        catch (err) {
            cb(err, pf);
        }
    }
    createFromId(id, cb) {
        if (!id) {
            cb(`plan file with id '${id}' was not found`);
            return;
        }
        this.loadPlanFile(id, (err, data) => {
            if (err) {
                cb(err);
                return;
            }
            const pf = new planFile_1.PlanFile();
            try {
                if (data) {
                    pf.initialize(data.meta, data.content);
                    this.savePlanFile(id, data.meta, data.content, e => {
                        cb(e, pf);
                    });
                }
            }
            catch (err) {
                cb(err);
            }
        });
    }
    savePlanFile(id, meta, content, cb) {
        // id and meta are going to the localStorage, content to the IDB
        if (!id) {
            if (cb) {
                cb("id is not provided");
            }
            return;
        }
        try {
            if (meta) {
                localStorage.setItem(localStoragePrefix + id, meta);
            }
            if (content) {
                this.idb((store, cbb) => {
                    const request = store.put({ id: id, content: content });
                    request.addEventListener("success", (e) => {
                        cbb(null);
                    });
                    request.addEventListener("error", (e) => {
                        cbb("error storing content to IDB");
                    });
                }, err => {
                    if (cb) {
                        cb(err);
                    }
                });
            }
            else {
                if (cb) {
                    cb(null);
                }
            }
        }
        catch (err) {
            if (cb) {
                cb(err);
            }
        }
    }
    loadPlanFile(id, cb) {
        // id and meta are going to the localStorage, content to the IDB
        if (!id) {
            if (cb) {
                cb("id is not provided");
            }
            return;
        }
        try {
            const meta = localStorage.getItem(localStoragePrefix + id);
            if (!meta) {
                if (cb) {
                    cb(`plan info ${id} was not found`);
                }
            }
            let content;
            this.idb((store, cbb) => {
                const request = store.get(id);
                request.addEventListener("success", (e) => {
                    if (request.result && request.result.content) {
                        content = request.result.content;
                        cbb(null);
                    }
                    else {
                        cbb(`item ${id} was not found`);
                    }
                });
                request.addEventListener("error", (e) => {
                    cbb("error storing content to IDB");
                });
            }, err => {
                if (cb) {
                    cb(err, { meta: (meta ? meta : undefined), content });
                }
            });
        }
        catch (err) {
            if (cb) {
                cb(err);
            }
        }
    }
    removePlanFile(id) {
        // id and meta are going to the localStorage, content to the IDB
        if (!id) {
            return;
        }
        try {
            localStorage.removeItem(localStoragePrefix + id);
            this.idb((store, cbb) => {
                const request = store.delete(id);
            }, (err) => { });
            const lf = this.lookupFile(id);
            if (lf) {
                this.planFiles.remove(lf);
            }
        }
        catch (err) {
        }
    }
    idb(handler, cb) {
        const supratimasDB = indexedDB.open("supratimasDB", 2);
        supratimasDB.addEventListener("upgradeneeded", event => {
            const db = supratimasDB.result;
            const store = db.createObjectStore("PlanFile", { keyPath: "id" });
        });
        supratimasDB.addEventListener("success", event => {
            const db = supratimasDB.result;
            const tx = db.transaction("PlanFile", "readwrite");
            const store = tx.objectStore("PlanFile");
            tx.addEventListener("complete", (event) => {
                db.close();
            });
            handler(store, err => {
                cb(err);
            });
        });
    }
    getPlanFiles() {
        const items = [];
        const l = window.localStorage.length;
        for (let i = 0; i < l; i++) {
            let key = window.localStorage.key(i);
            if (key && this.isPlanFile(key)) {
                items.push({ id: key, meta: window.localStorage[key] });
            }
        }
        return items;
    }
    isPlanFile(id) {
        return id.substring(0, localStoragePrefix.length) === localStoragePrefix;
    }
}
exports.PlanFileManager = PlanFileManager;
exports.planFileManager = new PlanFileManager();
//# sourceMappingURL=planFileManager.js.map