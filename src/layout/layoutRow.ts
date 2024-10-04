import { LayoutNode } from "./layoutNode";

export class LayoutRow {

    dataWriteCount: number = 0;
    nodes: LayoutNode[] = [];

    top: number = 0;
    height: number = 0;
    outerHeight: number = 0;

    measureLayout(top: number): number {

        let height = 0
        for (const node of this.nodes) {
            height = Math.max(height, node.height);
        }
        this.height = height;

        height += verticalMargin;
        height += this.dataWriteCount * verticalStorageConnector;
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

export const verticalMargin = 20;
export const verticalStorageConnector = 10;