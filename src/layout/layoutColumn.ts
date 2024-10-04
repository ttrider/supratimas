import { LayoutNode } from "./layoutNode";

export class LayoutColumn {

    connectors: number = 0;
    nodes: LayoutNode[] = [];

    width: number = 0;
    outerWidth: number = 0;
    left: number = 0;

    measureLayout(left: number): number {

        let width = 0
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

export function getConnectorsPadding(connectors: number): number {
    return horizontalMargin +
        connectors * connectorBaseSize;
}

export const horizontalMargin = 20;
export const connectorBaseSize = 7;
export const storageConnectorMargin = 10;