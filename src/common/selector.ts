export class Selector<T extends SelectorItem> {

    private selectorId: string;
    items: KnockoutObservableArray<T> = ko.observableArray();
    length: KnockoutComputed<number>;
    selected: KnockoutComputed<T | null>;
    selectedItems: KnockoutComputed<Array<T>>;

    constructor(selectorId: string, initialData: Array<T> = []) {
        this.selectorId = selectorId;
        const selectedItemId = Selector.getSelector(selectorId);

        this.replace(initialData, selectedItemId);

        this.length = ko.computed(() => {
            return this.items().length;
        });

        this.selected = ko.computed<T | null>(() => {

            for (let i of this.items()) {
                if (i.selected()) {
                    return i;
                }
            }
            return null;
        });

        this.selectedItems = ko.computed<Array<T>>(() => {

            var ret = [];
            for (let i of this.items()) {
                if (i.selected()) {
                    ret.push(i);
                }
            }
            return ret;
        });
    }



    remove(item: string | T) {

        let itemId = this.getItemId(item);
        if (!itemId) {
            return;
        }

        for (let i of this.items()) {
            if (i.itemId === itemId) {
                this.items.remove(i);
                this.select();
                return;
            }
        }
    }

    clear() {
        this.items.removeAll();
    }

    addSelected(item: T): T | undefined {
        let sel = this.add(item);
        if (sel) {
            this.select(sel);
        }
        return sel;
    }

    add(item: T): T | undefined {

        if (!item) {
            return;
        }

        item.subscription.subscribe((val) => {
            switch (val) {
                case "select":
                    this.select(item);
                    break;
                case "toggle":
                    this.toggle(item);
                    break;
            }
        });


        let itemId = item.itemId;

        for (let i of this.items()) {
            if (i.itemId === itemId) {
                this.items.replace(i, item);
                return item;
            }
        }
        this.items.push(item);
        return item;
    }

    resetSelection() {
        for (var it of this.items()) {
            it.selected(false);
        }
        Selector.deleteSelector(this.selectorId);
    }

    select = (item?: string | T) => {

        if (this.items().length > 0) {
            if (!item) {
                // if something is selected - keep it
                // if nothing is selected - select first
                if (this.items().length > 0) {
                    for (var stmt of this.items()) {
                        if (stmt.selected()) {
                            return;
                        }
                    }
                    this.items()[0].selected(true);
                }
                return;
            }

            let itemId = this.getItemId(item);

            let selItem = null;
            for (var it of this.items()) {

                if (it.itemId === itemId) {
                    selItem = it;
                }
                else {
                    it.selected(false);
                }
            }

            if (!selItem) {
                selItem = this.items()[0];
            }

            if (selItem) {
                selItem.selected(true);
            }

            Selector.setSelector(this.selectorId, selItem.itemId);
        }
    }

    toggle(item: string | T) {
        if (!item) {
            return;
        }

        let itemId = this.getItemId(item);

        for (var it of this.items()) {
            if (it.itemId === itemId) {
                it.selected(!it.selected());
                break;
            }
        }

        Selector.setSelector(this.selectorId, itemId);
    }

    replace = (items: Array<T>, selectedId: string) => {
        if (!items) {
            return;
        }

        let copy = [];
        for (let i of items) {
            i.subscription.subscribe((val) => {
                switch (val) {
                    case "select":
                        this.select(i);
                        break;
                    case "toggle":
                        this.toggle(i);
                        break;
                }
            });
            copy.push(i);
        }

        if (this.items) {
            this.items(copy);
        }
        else {
            this.items = ko.observableArray(copy);
        }

        this.select(selectedId);
    }

    private getItemId(item: string | T) {
        if (!item) {
            return;
        }
        if (this.isString(item)) {
            return item;
        }
        else {
            return item.itemId;
        }
    }

    private isString(item: string | T): item is string {
        return typeof item === "string";
    }

    private isItem(item: string | T): item is T {
        return !this.isString(item);
    }

    static getSelector(id: string, defaultValue: string = ""): string {
        if (id && window.localStorage) {
            let s = window.localStorage.getItem(id + "_selector");
            if (s) {
                return s;
            }
        }
        return defaultValue;
    }
    static setSelector(id: string, value?: string) {

        if (id && window.localStorage) {
            if (value) {
                window.localStorage.setItem(id + "_selector", value);
            }
            else {
                window.localStorage.removeItem(id + "_selector");
            }
        }
    }
    static deleteSelector(id: string) {
        Selector.setSelector(id);
    }
}

export class SelectorItem {
    get itemId(): string {
        return this.idProvider();
    }
    selected: KnockoutObservable<boolean> = ko.observable(false);
    state: { [key: string]: any } = {};
    subscription: KnockoutSubscribable<string> = new ko.subscribable();

    constructor(private idProvider: () => string) {
    }

    select() {
        this.subscription.notifySubscribers("select");
    }
    toggle() {
        this.subscription.notifySubscribers("toggle");
    }
}

export function initializeSelectorHandlers() {

    ko.bindingHandlers.clickToSelectItem = {
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {

            const selectorItem = bindingContext.$data as SelectorItem;
            const mode = valueAccessor();

            switch (mode) {
                case 'toggle':
                    element.addEventListener("click", (ev) => {
                        ev.cancelBubble = true;
                        ev.stopPropagation();
                        ev.preventDefault();
                        selectorItem.toggle();
                    });
                    break;
                case 'alwaysSelect':
                    element.addEventListener("click", (ev) => {
                        ev.cancelBubble = true;
                        ev.stopPropagation();
                        ev.preventDefault();
                        selectorItem.select();
                    });
                    break;

                default:
                    selectorItem.selected.subscribe((val) => {
                        element.style.cursor = val ? "default" : "pointer";
                    });
                    element.addEventListener("click", (ev) => {
                        ev.cancelBubble = true;
                        ev.stopPropagation();
                        ev.preventDefault();

                        if (!selectorItem.selected()) {
                            selectorItem.select();
                        }
                    });
                    break;
            }
        }
    };
}

