export class SortedSet<T> {

    constructor(public keyFunction: (item: T) => any) {

        this.data = ko.observableArray<T>();
        this.data.subscribe((newVal) => {
            this.updated = true;
        });

        this.count = ko.computed<number>(() => {
            return this.data().length;
        });
    }

    cloneInto(newSet: SortedSet<T>, clone: (item: T) => T) {

        let items: Array<T> = [];
        for (let item of this.data()) {
            items.push(clone(item));
        }
        newSet.data(items);
    }

    mergeWith(incoming: SortedSet<T>, merge: (existing: T, incoming: T) => void, clone: (item: T) => T) {

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

    lookup(key: any): T | undefined {

        // lookup item
        const ar = this.data();
        for (let i = 0; i < ar.length; i++) {
            if (this.keyFunction(ar[i]) === key) {
                return ar[i];
            }
        }
    }

    getOrAdd(key: any, factory: (k: any) => T): T {

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

    getItems(): Array<T> {

        if (this.updated) {
            this.data.sort((a, b) => { return this.keyFunction(a) - this.keyFunction(b); });
            this.updated = false;
        }
        return this.data();
    }

    count: KnockoutComputed<number>;

    data: KnockoutObservableArray<T>;
    updated: boolean = false;
}