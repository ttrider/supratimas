"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringBuilder {
    constructor(...values) {
        this.parts = [];
        this.append(values);
    }
    get isEmpty() {
        return this.parts.length === 0;
    }
    append(value) {
        if (value != null && value != undefined) {
            if (Array.isArray(value)) {
                for (const v of value) {
                    if (v != null && v != undefined) {
                        this.pushPart(v);
                    }
                }
            }
            else {
                this.pushPart(value);
            }
        }
        return this;
    }
    pushPart(item) {
        if (typeof item === "number") {
            item = item.toString();
        }
        this.parts.push(item);
    }
    format(separator) {
        const ret = [];
        for (const item of this.parts) {
            if (item) {
                const itemVal = (typeof item === "function") ? item() : item;
                if (itemVal) {
                    ret.push(itemVal);
                }
            }
        }
        return ret.join(separator);
    }
}
exports.StringBuilder = StringBuilder;
//# sourceMappingURL=stringBuilder.js.map