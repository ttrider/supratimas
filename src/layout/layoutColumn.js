"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LayoutColumn {
    constructor() {
        this.connectors = 0;
        this.nodes = [];
        this.width = 0;
        this.outerWidth = 0;
        this.left = 0;
    }
    measureLayout(left) {
        let width = 0;
        for (const node of this.nodes) {
            width = Math.max(width, node.width);
        }
        this.width = width;
        this.outerWidth = width + getConnectorsPadding(this.connectors);
        this.left = left;
        left += this.outerWidth;
        return left;
    }
    updateLayout() {
        for (const node of this.nodes) {
            let left = this.left;
            let offset = this.width - node.width;
            // if (scale < 1) {
            //     left += node.width * scale;
            // }
            left += offset;
            node.left = left;
        }
    }
}
exports.LayoutColumn = LayoutColumn;
function getConnectorsPadding(connectors) {
    return exports.horizontalMargin +
        connectors * exports.connectorBaseSize;
}
exports.getConnectorsPadding = getConnectorsPadding;
exports.horizontalMargin = 20;
exports.connectorBaseSize = 7;
exports.storageConnectorMargin = 10;
//# sourceMappingURL=layoutColumn.js.map