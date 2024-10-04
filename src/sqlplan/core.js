"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addOrUpdate(array, index, add, update) {
    const oldValue = array[index];
    if (oldValue === undefined) {
        const value = add(index);
        array[index] = value;
        return value;
    }
    const value = update(index, oldValue);
    array[index] = value;
    return value;
}
exports.addOrUpdate = addOrUpdate;
function getOrAdd(array, indexOrKey, add) {
    if (Array.isArray(array)) {
        const oldValue = array[indexOrKey];
        if (oldValue === undefined) {
            const value = add(indexOrKey);
            array[indexOrKey] = value;
            return value;
        }
        return oldValue;
    }
    const oldValue = array[indexOrKey];
    if (oldValue === undefined) {
        const value = add(indexOrKey);
        array[indexOrKey] = value;
        return value;
    }
    return oldValue;
}
exports.getOrAdd = getOrAdd;
class Stack {
    // Constructor
    constructor() {
        this.stack = [];
        delete this.current;
    }
    push(item) {
        if (item != null) {
            this.current = item;
            this.stack.push(item);
        }
        return item;
    }
    pop() {
        var l = this.stack.length;
        if (l > 0) {
            l--;
            var item = this.stack[l];
            this.stack.pop();
            if (l > 0) {
                l--;
                this.current = this.stack[l];
            }
            else {
                delete this.current;
            }
            return item;
        }
        else {
            delete this.current;
            return null;
        }
    }
    isEmpty() {
        return this.stack.length === 0;
    }
}
exports.Stack = Stack;
//# sourceMappingURL=core.js.map