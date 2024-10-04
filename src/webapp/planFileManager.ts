import { PlanFile } from "./planFile";

const localStoragePrefix = "plan.file.";

export class PlanFileManager {

    constructor() {

        window.addEventListener("storage", e => {

            if (!e.key) {
                this.planFiles.removeAll();

            } else

                if (this.isPlanFile(e.key)) {
                    const item = this.lookupFile(e.key);
                    if (item) {
                        if (e.newValue) {

                            const newItem = new PlanFile().initialize((<any>(e.newValue)).meta);

                            this.planFiles.replace(item, newItem);

                        } else {
                            this.planFiles.remove(item);
                        }
                    }
                } else {
                    return;
                }

            this.planFiles.sort(this.sortFunction);
        });
    }

    private sortFunction(left: PlanFile, right: PlanFile) {
        return left.name.localeCompare(right.name);
    }

    planFiles: KnockoutObservableArray<PlanFile> = ko.observableArray<PlanFile>(
        (() => {

            const ret = [];

            for (const planFileInfo of this.getPlanFiles()) {
                ret.push(new PlanFile().initialize(planFileInfo.meta));
            }

            ret.sort(this.sortFunction);

            return ret;
        })()
    );

    lookupFile(id: string): PlanFile | null {
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

    createFromFile(file: File, cb: Callback<PlanFile>) {

        const pf = new PlanFile();

        pf.name = file.name;
        pf.size = file.size;
        pf.lastModified = new Date(file.lastModified);

        var reader: FileReader = new FileReader();
        reader.addEventListener("load", (e: any) => {

            if (e.target.error) {
                cb(e.target.error, pf);
            } else {

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


    createFromClipboard(data: string, cb: Callback<PlanFile>) {

        const pf = new PlanFile();

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

    createFromId(id: string, cb: Callback<PlanFile>) {

        if (!id) {
            cb(`plan file with id '${id}' was not found`);
            return;
        }

        this.loadPlanFile(id, (err, data) => {

            if (err) {
                cb(err);
                return;
            }

            const pf = new PlanFile();
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

    savePlanFile(id: string, meta?: string, content?: string, cb?: Callback<PlanFile>) {
        // id and meta are going to the localStorage, content to the IDB

        if (!id) {
            if (cb) { cb("id is not provided"); }
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
                    })

                }, err => {
                    if (cb) {
                        cb(err);
                    }
                });

            } else {
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

    loadPlanFile(id: string, cb?: Callback<{ meta?: string, content?: string }>) {
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

            let content: string;

            this.idb((store, cbb) => {

                const request = store.get(id);
                request.addEventListener("success", (e) => {
                    if (request.result && request.result.content) {
                        content = request.result.content;
                        cbb(null);
                    } else {
                        cbb(`item ${id} was not found`);
                    }
                });
                request.addEventListener("error", (e) => {
                    cbb("error storing content to IDB");
                })

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

    removePlanFile(id: string) {
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


    private idb(handler: (store: IDBObjectStore, cb: (err: CallbackError) => void) => void, cb: (err: CallbackError) => void) {


        const supratimasDB = indexedDB.open("supratimasDB", 2);
        supratimasDB.addEventListener("upgradeneeded", event => {
            const db = supratimasDB.result;
            const store = db.createObjectStore("PlanFile", { keyPath: "id" });
        });

        supratimasDB.addEventListener("success", event => {
            const db = supratimasDB.result;
            const tx = db.transaction("PlanFile", "readwrite");
            const store: IDBObjectStore = tx.objectStore("PlanFile");
            tx.addEventListener("complete", (event: any) => {
                db.close();
            });
            handler(store, err => {
                cb(err);
            });
        });
    }

    private getPlanFiles() {

        const items: Array<{ id: string, meta: string }> = [];

        const l = window.localStorage.length;
        for (let i = 0; i < l; i++) {
            let key = window.localStorage.key(i);
            if (key && this.isPlanFile(key)) {
                items.push({ id: key, meta: window.localStorage[key] });
            }
        }
        return items;
    }

    private isPlanFile(id: string): boolean {
        return id.substring(0, localStoragePrefix.length) === localStoragePrefix;
    }
}

export const planFileManager = new PlanFileManager();

