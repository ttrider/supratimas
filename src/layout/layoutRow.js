"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LayoutRow {
    constructor() {
        this.dataWriteCount = 0;
        this.nodes = [];
        this.top = 0;
        this.height = 0;
        this.outerHeight = 0;
    }
    measureLayout(top) {
        let height = 0;
        for (const node of this.nodes) {
            height = Math.max(height, node.height);
        }
        this.height = height;
        height += exports.verticalMargin;
        height += this.dataWriteCount * exports.verticalStorageConnector;
        this.outerHeight = height;
        this.top = top;
        top += this.outerHeight;
        return top;
    }
    updateLayout() {
        for (const node of this.nodes) {
            node.top = this.top;
        }
    }
}
exports.LayoutRow = LayoutRow;
exports.verticalMargin = 20;
exports.verticalStorageConnector = 10;
//# sourceMappingURL=layoutRow.js.map