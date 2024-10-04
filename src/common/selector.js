"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Selector {
    constructor(selectorId, initialData = []) {
        this.items = ko.observableArray();
        this.select = (item) => {
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
        };
        this.replace = (items, selectedId) => {
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
        };
        this.selectorId = selectorId;
        const selectedItemId = Selector.getSelector(selectorId);
        this.replace(initialData, selectedItemId);
        this.length = ko.computed(() => {
            return this.items().length;
        });
        this.selected = ko.computed(() => {
            for (let i of this.items()) {
                if (i.selected()) {
                    return i;
                }
            }
            return null;
        });
        this.selectedItems = ko.computed(() => {
            var ret = [];
            for (let i of this.items()) {
                if (i.selected()) {
                    ret.push(i);
                }
            }
            return ret;
        });
    }
    remove(item) {
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
    addSelected(item) {
        let sel = this.add(item);
        if (sel) {
            this.select(sel);
        }
        return sel;
    }
    add(item) {
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
    toggle(item) {
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
    getItemId(item) {
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
    isString(item) {
        return typeof item === "string";
    }
    isItem(item) {
        return !this.isString(item);
    }
    static getSelector(id, defaultValue = "") {
        if (id && window.localStorage) {
            let s = window.localStorage.getItem(id + "_selector");
            if (s) {
                return s;
            }
        }
        return defaultValue;
    }
    static setSelector(id, value) {
        if (id && window.localStorage) {
            if (value) {
                window.localStorage.setItem(id + "_selector", value);
            }
            else {
                window.localStorage.removeItem(id + "_selector");
            }
        }
    }
    static deleteSelector(id) {
        Selector.setSelector(id);
    }
}
exports.Selector = Selector;
class SelectorItem {
    constructor(idProvider) {
        this.idProvider = idProvider;
        this.selected = ko.observable(false);
        this.state = {};
        this.subscription = new ko.subscribable();
    }
    get itemId() {
        return this.idProvider();
    }
    select() {
        this.subscription.notifySubscribers("select");
    }
    toggle() {
        this.subscription.notifySubscribers("toggle");
    }
}
exports.SelectorItem = SelectorItem;
function initializeSelectorHandlers() {
    ko.bindingHandlers.clickToSelectItem = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const selectorItem = bindingContext.$data;
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
exports.initializeSelectorHandlers = initializeSelectorHandlers;
//# sourceMappingURL=selector.js.map