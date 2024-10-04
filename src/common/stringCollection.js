"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatter = require("../sqlplan/formatter");
class StringCollection {
    constructor(lines, normalLength, maxLength) {
        this.lines = lines;
        this.normalLength = normalLength;
        this.maxLength = maxLength;
        this.items = [];
        this.collapsed = true;
        this.collapsable = false;
        this.toggle = (data, e) => {
            this.collapsed = !this.collapsed;
            for (const item of this.items) {
                if (typeof item.value !== "string") {
                    item.value(formatter.formatName(item.originalValue, this.collapsed ? this.normalLength : this.maxLength));
                }
            }
            this.updated.notifySubscribers(e.target);
        };
        this.updated = new ko.subscribable();
        for (const line of lines) {
            if (line) {
                if (line.length > normalLength) {
                    this.items.push({ value: ko.observable(formatter.formatName(line, this.normalLength)), originalValue: line });
                    this.collapsable = true;
                }
                else {
                    this.items.push({ value: line, originalValue: line });
                }
            }
        }
    }
}
exports.StringCollection = StringCollection;
//# sourceMappingURL=stringCollection.js.map