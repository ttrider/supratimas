"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SortedSet {
    constructor(keyFunction) {
        this.keyFunction = keyFunction;
        this.updated = false;
        this.data = ko.observableArray();
        this.data.subscribe((newVal) => {
            this.updated = true;
        });
        this.count = ko.computed(() => {
            return this.data().length;
        });
    }
    cloneInto(newSet, clone) {
        let items = [];
        for (let item of this.data()) {
            items.push(clone(item));
        }
        newSet.data(items);
    }
    mergeWith(incoming, merge, clone) {
        for (let item of incoming.data()) {
            const key = this.keyFunction(item);
            let existing = this.lookup(key);
            if (existing) {
                merge(existing, item);
            }
            else {
                this.data.push(clone(item));
            }
        }
    }
    lookup(key) {
        // lookup item
        const ar = this.data();
        for (let i = 0; i < ar.length; i++) {
            if (this.keyFunction(ar[i]) === key) {
                return ar[i];
            }
        }
    }
    getOrAdd(key, factory) {
        // lookup item
        const ar = this.data();
        for (let i = 0; i < ar.length; i++) {
            if (this.keyFunction(ar[i]) === key) {
                return ar[i];
            }
        }
        const item = factory(key);
        this.data.push(item);
        return item;
    }
    getItems() {
        if (this.updated) {
            this.data.sort((a, b) => { return this.keyFunction(a) - this.keyFunction(b); });
            this.updated = false;
        }
        return this.data();
    }
}
exports.SortedSet = SortedSet;
//# sourceMappingURL=sortedSet.js.map