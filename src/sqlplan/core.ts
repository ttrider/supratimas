

export function addOrUpdate<T>(array: T[], index: number, add: (index: number) => T, update: (index: number, oldValue: T) => T): T {

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


export function getOrAdd<T>(array: T[] | { [name: string]: T }, indexOrKey: number | string, add: (indexOrKey: any) => T): T {

    if (Array.isArray(array)) {
        const oldValue = array[<number>indexOrKey];
        if (oldValue === undefined) {
            const value = add(indexOrKey);
            array[<number>indexOrKey] = value;
            return value;
        }
        return oldValue;
    }

    const oldValue = array[<string>indexOrKey];
    if (oldValue === undefined) {
        const value = add(indexOrKey);
        array[indexOrKey] = value;
        return value;
    }
    return oldValue;
}


export class Stack<T> {

    stack: Array<T>;
    current?: T;

    // Constructor
    constructor() {
        this.stack = [];
        delete this.current;
    }

    push(item: T): T {
        if (item != null) {
            this.current = item;
            this.stack.push(item);
        }
        return item;
    }

    pop(): T | null {
        var l = this.stack.length;
        if (l > 0) {
            l--;
            var item = this.stack[l];
            this.stack.pop();
            if (l > 0) {
                l--;
                this.current = this.stack[l];
            } else {
                delete this.current;
            }
            return item;
        } else {
            delete this.current;
            return null;
        }
    }

    isEmpty(): boolean {
        return this.stack.length === 0;
    }

}