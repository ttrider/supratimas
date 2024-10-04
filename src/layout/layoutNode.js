"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../common/util");
class LayoutNode {
    constructor(element) {
        this.element = element;
        this.dataWriteIndex = 0;
        this.connectors = [];
        this.incomingElements = [];
        this.node = ko.dataFor(element);
    }
    get column() {
        return this.node.column;
    }
    get row() {
        return this.node.row;
    }
    get nodeId() {
        return this.node.nodeId;
    }
    get isDataWrite() {
        return this.node.node.metrics.isDataWrite;
    }
    get isStorage() {
        return !!this.node.node.dataInfo.rowSetObject;
    }
    get selected() {
        return this.node.selected();
    }
    get width() {
        return this.element.offsetWidth;
    }
    get height() {
        return this.element.offsetHeight;
    }
    get top() {
        return this.element.offsetTop;
    }
    set top(top) {
        this.element.style.top = top + "px";
    }
    set left(left) {
        this.element.style.left = left + "px";
    }
    get left() {
        return this.element.offsetLeft;
    }
    get rect() {
        return util_1.Rect.fromPositionAndSize(this.left, this.top, this.width, this.height);
    }
}
exports.LayoutNode = LayoutNode;
class LayoutNodePreview {
    constructor() {
        this.visible = ko.observable(false);
        this.isCostly = ko.observable(false);
        this.formattedCost = ko.observable();
        this.iconTemplate = ko.observable("pi_default");
        this.nameSet = ko.observable();
        this.left = ko.observable("0");
        this.top = ko.observable("0");
    }
    showNode(layoutNode, position) {
        if (layoutNode) {
            this.isCostly(layoutNode.node.node.metrics.isCostly);
            this.formattedCost(layoutNode.node.formattedCost);
            this.iconTemplate(layoutNode.node.iconTemplate);
            this.nameSet(layoutNode.node.nameSet);
            this.left(Math.round(position.left).toString() + "px");
            this.top(Math.round(position.top).toString() + "px");
            this.visible(true);
        }
        else {
            this.visible(false);
            this.isCostly(false);
            this.formattedCost(null);
            this.iconTemplate("pi_default");
            this.nameSet(null);
        }
    }
    hideNode() {
        this.visible(false);
        this.isCostly(false);
        this.formattedCost(null);
        this.iconTemplate("pi_default");
        this.nameSet(null);
    }
}
exports.LayoutNodePreview = LayoutNodePreview;
//# sourceMappingURL=layoutNode.js.map