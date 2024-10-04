import { LayoutManager } from "./layout";
import { LayoutNode, LayoutNodePreview } from "./layoutNode";


export class NodeSelector {

    node?: LayoutNode;
    previewNode: LayoutNodePreview;
    constructor(public layoutManager: LayoutManager, public element: HTMLElement, public info: { nodeId: string, left?: number, top?: number, right?: number, bottom?: number, anchor?: string, scale?: number }) {

        if (!this.layoutManager.viewElement) throw new Error("layoutManager.viewElement is empty");
        const viewElement = this.layoutManager.viewElement;

        this.previewNode = layoutManager.previewNode;

        element.addEventListener("click", (ev) => {
            ev.cancelBubble = true;
            ev.stopPropagation();
            ev.preventDefault();
            if (info.scale != undefined) {
                layoutManager.setScale("manual", info.scale, () => {
                    layoutManager.selectNode(info.nodeId);
                });
            }
            else {
                layoutManager.selectNode(info.nodeId);
            }
        });

        // element.addEventListener("mousemove", (ev) => {
        //     ev.cancelBubble = true;
        //     ev.stopPropagation();
        //     ev.preventDefault();
        //     console.info("mousemove");
        // });

        if (info.left && info.top) {

            element.addEventListener("mouseenter", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();

                // display preview only if the target node
                // is not visible
                const targetElement = this.layoutManager.getNode(info.nodeId);
                if (!targetElement) {
                    return;
                }
                const targetRect = targetElement.rect;
                const viewport = this.layoutManager.viewport;

                if (
                    targetRect.left > viewport.left &&
                    targetRect.top > viewport.top &&
                    targetRect.right < viewport.right &&
                    targetRect.bottom < viewport.bottom
                ) {
                    return;
                }

                const anchor = (info.anchor) ? info.anchor.toLowerCase() : "mouse";
                const position = { left: 0, top: 0 };

                switch (anchor) {
                    case "mouse":
                        position.left = ev.x + viewElement.scrollLeft;
                        if (info.left) {
                            position.left += info.left;
                        }
                        if (info.right) {
                            position.left += info.right;
                        }
                        position.top = ev.y + viewElement.scrollTop;
                        if (info.top) {
                            position.top += info.top;
                        }
                        if (info.bottom) {
                            position.top += info.bottom;
                        }
                        break;
                    case "element":
                        const rectElement = element.getBoundingClientRect();
                        if (info.left) {
                            position.left = rectElement.left + info.left;
                        }
                        if (info.right) {
                            position.left = rectElement.right + info.right;
                        }
                        position.top = ev.y + viewElement.scrollTop;
                        if (info.top) {
                            position.top = rectElement.top + info.top;
                        }
                        if (info.bottom) {
                            position.top = rectElement.bottom + info.bottom;
                        }
                        if (this.layoutManager.drawingsElement) {
                            const drawRect = this.layoutManager.drawingsElement.getBoundingClientRect();

                            position.top -= drawRect.top;
                            position.left -= drawRect.left;
                        }
                        break;

                }

                if (!this.node) {
                    this.node = layoutManager.getNode(info.nodeId);
                }
                if (this.node) {
                    this.previewNode.showNode(this.node, position);
                }
            });

            element.addEventListener("mouseleave", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                this.previewNode.hideNode();
            });
        }
    }



}