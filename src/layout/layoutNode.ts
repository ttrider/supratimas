
import { AppNodeBase } from "../app/node";
import { StringCollection } from "../common/stringCollection";
import { Rect } from "../common/util";
import { Connector } from "./layout";

export class LayoutNode {
    dataWriteIndex: number = 0;
    connectors: Connector[] = [];
    node: AppNodeBase;
    outgoingElement?: HTMLElement;
    incomingElements: HTMLElement[] = [];

    get column(): number {
        return this.node.column;
    }

    get row(): number {
        return this.node.row;
    }

    get nodeId(): string {
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

    get top(): number {
        return this.element.offsetTop;
    }
    set top(top: number) {
        this.element.style.top = top + "px";
    }
    set left(left: number) {
        this.element.style.left = left + "px";
    }
    get left(): number {
        return this.element.offsetLeft;
    }

    get rect(): ClientRect {
        return Rect.fromPositionAndSize(this.left, this.top, this.width, this.height);
    }


    constructor(public element: HTMLElement) {
        this.node = ko.dataFor(element);
    }
}

export class LayoutNodePreview {
    visible: KnockoutObservable<boolean> = ko.observable(false);
    isCostly: KnockoutObservable<boolean> = ko.observable(false);
    formattedCost: KnockoutObservable<string> = ko.observable();
    iconTemplate: KnockoutObservable<string> = ko.observable("pi_default");
    nameSet: KnockoutObservable<StringCollection> = ko.observable();
    left: KnockoutObservable<string> = ko.observable("0");
    top: KnockoutObservable<string> = ko.observable("0");

    showNode(layoutNode: LayoutNode, position: { left: number, top: number }) {
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