import { NodeView } from "../app/view";
import { AppNodeBase, AppNode, AppStatementNode } from "../app/node";
import { getOrAdd, addOrUpdate, Rect } from "../common/util";
import { LayoutNode, LayoutNodePreview } from "./layoutNode";
import { LayoutColumn, getConnectorsPadding, horizontalMargin, storageConnectorMargin, connectorBaseSize } from "./layoutColumn";
import { LayoutRow, verticalMargin, verticalStorageConnector } from "./layoutRow";
import { AppPlan } from "../app/plan";
import { AppNodeViewModel } from "../app/nodeViewModel";


export class LayoutManager {

    viewModel: KnockoutObservable<AppNodeViewModel> = ko.observable();

    indexElement?: HTMLElement;
    queryElement?: HTMLElement;
    storageElement?: HTMLElement;
    viewElement?: HTMLElement;
    canvasElement?: HTMLElement;
    nodesElement?: HTMLElement;
    statementsElement?: HTMLElement;
    drawingsElement?: SVGElement;


    storageConnectors: { [name: string]: StorageConnector } = {};
    connectors: { [name: string]: Connector } = {};
    statementsConnectorsCount: number = 0;

    layoutMatrix: LayoutNode[][] = [];
    layoutColumns: LayoutColumn[] = [];
    layoutRows: LayoutRow[] = [];
    layoutNodes: { [name: string]: LayoutNode } = {};
    storageNodes: { [name: string]: LayoutNode } = {};
    statementNodes: { [name: string]: LayoutNode } = {};

    previewNode: LayoutNodePreview = new LayoutNodePreview();


    statementsPanelLeft: KnockoutObservable<number> = ko.observable(0);
    nodesPanelLeft: KnockoutObservable<number> = ko.observable(0);
    storagePanelLeft: KnockoutObservable<number> = ko.observable(0);
    queryPanelLeft: KnockoutObservable<number> = ko.observable(0);
    indexPanelLeft: KnockoutObservable<number> = ko.observable(0);

    scale: KnockoutObservable<number> = ko.observable(1);
    iconScale: KnockoutComputed<string> = ko.pureComputed(() => {
        const sc = this.scale();
        let compensateScale = 1 / sc;
        return compensateScale + "em";
    });
    noteTemplate: KnockoutComputed<string> = ko.pureComputed(() => {
        return "plan-node-info-template";
    });

    //#region INITIALIZE

    constructor(public plan: AppPlan) {

        this.scale = ko.observable(this.plan.nodeViewMetadata.scale);
        this.scale.subscribe((val) => {
            this.plan.updateNodeViewMetadata({
                scale: val,
                scrollLeft: null,
                scrollTop: null,
                showInfo: null
            })
        });

    }

    initializeViewModel(viewElement: HTMLElement, viewModel: KnockoutObservable<AppNodeViewModel>): LayoutManager {

        this.viewElement = viewElement;
        this.viewModel = viewModel;


        viewElement.addEventListener("scroll", () => { this.onScroll(); });
        viewElement.addEventListener("zoom", () => { this.onBrowserZoom(); });
        return this;
    }

    postRenderInitialize() {
        // collect imporatant elements
        this.canvasElement = this.getElementByClass<HTMLElement>(cssCanvas);
        this.drawingsElement = this.getElementByClass<SVGElement>(cssDrawings);
        this.nodesElement = this.getElementByClass<HTMLElement>(cssNodes);
        this.statementsElement = this.getElementByClass<HTMLElement>(cssStatements);
        this.storageElement = this.getElementByClass<HTMLElement>(cssStorage);
        this.queryElement = this.getElementByClassIfExists<HTMLElement>(cssQuerytext);
        this.indexElement = this.getElementByClassIfExists<HTMLElement>(cssIndextext);

        // initialize node layout
        this.nodesElement.style.visibility = "hidden";
        this.storageElement.style.visibility = "hidden";
        if (this.queryElement) {
            this.queryElement.style.visibility = "hidden";
        }
        if (this.indexElement) {
            this.indexElement.style.visibility = "hidden";
        }


        this.initializeConnectorLayout();
        this.initializeStatementsLayout();
        this.initializeNodesLayout();
        this.reconcileConnectors();


        this.viewModel().updated.subscribe((element) => {
            this.updateLayout();
        });

        const oldleft = this.plan.nodeViewMetadata.scrollLeft;
        const oldtop = this.plan.nodeViewMetadata.scrollTop;

        window.requestAnimationFrame(() => {
            this.updateLayout(() => {
                if (this.viewElement) {
                    this.viewElement.scrollTo(oldleft ? oldleft : 0, oldtop ? oldtop : 0);
                }
            });
        });
    }

    private initializeStatementsLayout() {

        this.statementsConnectorsCount = 0;
        if (this.statementsElement) {

            for (let i = 0; i < this.statementsElement.children.length; i++) {
                let element = this.statementsElement.children[i] as HTMLElement;

                if (element.tagName.toLowerCase() !== "section") {

                    const layoutNode = new LayoutNode(element);

                    if (layoutNode.selected) {
                        this.statementsConnectorsCount++;
                    }

                    this.statementNodes[layoutNode.nodeId] = layoutNode;
                }
            }

            let index = 0;
            for (const nid in this.statementNodes) {
                if (this.statementNodes.hasOwnProperty(nid)) {
                    const layoutNode = this.statementNodes[nid];

                    if (layoutNode.selected) {
                        this.initializeIncomingConnectors(layoutNode, this.statementsConnectorsCount - index);
                        index++;
                    }
                }
            }
        }
    }
    private initializeNodesLayout() {

        if (this.nodesElement) {

            // reset connector count
            for (const column of this.layoutColumns) {
                if (column) {
                    column.connectors = 0;
                }
            }

            for (let i = 0; i < this.nodesElement.children.length; i++) {
                const element = this.nodesElement.children[i] as HTMLElement;

                const layoutNode = new LayoutNode(element);

                const layoutColumn = getOrAdd(this.layoutColumns, layoutNode.column, () => new LayoutColumn());
                const layoutRow = getOrAdd(this.layoutRows, layoutNode.row, () => new LayoutRow());
                layoutColumn.nodes.push(layoutNode);
                layoutRow.nodes.push(layoutNode);

                getOrAdd(
                    getOrAdd(this.layoutMatrix, layoutNode.column, () => [])
                    , layoutNode.row, () => layoutNode);


                layoutNode.outgoingElement = this.getElementByClass<HTMLElement>(cssNodeCost, element);

                layoutColumn.connectors += this.initializeIncomingConnectors(layoutNode);

                if (layoutNode.isDataWrite) {
                    layoutNode.dataWriteIndex = layoutRow.dataWriteCount;
                    layoutRow.dataWriteCount++;
                }

                this.layoutNodes[layoutNode.nodeId] = layoutNode;
                if (layoutNode.isStorage) {
                    this.storageNodes[layoutNode.nodeId] = layoutNode;
                }
            }
        }
    }

    private reconcileConnectors() {
        for (const cid in this.connectors) {
            if (this.connectors.hasOwnProperty(cid)) {
                const connector = this.connectors[cid];

                connector.sourceNode = this.getNode(connector.sourceId);
                connector.targetNode = this.getNode(connector.targetId);
                if (connector.sourceNode) {
                    connector.sourceElement = connector.sourceNode.outgoingElement;
                }
            }
        }

        for (const cid in this.storageConnectors) {
            if (this.storageConnectors.hasOwnProperty(cid)) {
                const connector = this.storageConnectors[cid];
                connector.node = this.layoutNodes[connector.nodeId];
            }
        }
    }
    private initializeIncomingConnectors(layoutNode: LayoutNode, baseOffset: number = 0) {
        const incomingElements = layoutNode.element.getElementsByClassName(cssNodeIncoming);
        const incomingItems = layoutNode.node.children;
        const max = Math.min(incomingElements.length, layoutNode.node.children.length);
        for (let i = 0; i < max; i++) {
            const incomingElement = incomingElements.item(i) as HTMLElement;
            layoutNode.incomingElements.push(incomingElement);

            const connectorId = layoutNode.nodeId + "_" + incomingItems[i].nodeId;
            const connector = this.connectors[connectorId];
            if (connector) {
                connector.targetElement = incomingElement;
                connector.sourceId = incomingItems[i].nodeId;
                connector.targetId = layoutNode.nodeId;
                connector.targetOffset = (max - i) + baseOffset;
                layoutNode.connectors.push(connector);
            }
        }
        return max;
    }

    private initializeConnectorLayout() {
        if (this.viewElement) {
            const roots = this.viewElement.getElementsByClassName(cssSvgRoot);
            if (roots && roots.length > 0) {
                const svgRoot = roots[0];

                const connectors = svgRoot.getElementsByClassName(cssConnectionGroup);
                for (let i = 0; i < connectors.length; i++) {
                    const connectorGroup = connectors[i] as SVGGElement;
                    const cid = connectorGroup.getAttribute("id");
                    if (cid) {

                        let connector: SVGPolylineElement | undefined = undefined;
                        let rightButton: SVGGElement | undefined = undefined;
                        let leftButton: SVGGElement | undefined = undefined;
                        let topButton: SVGGElement | undefined = undefined;
                        let bottomButton: SVGGElement | undefined = undefined;

                        for (let j = 0; j < connectorGroup.children.length; j++) {
                            const item = connectorGroup.children[j] as SVGElement;
                            switch (item.className.baseVal) {
                                case cssConnectorPath:
                                    connector = item as SVGPolylineElement;
                                    break;
                                case cssConnectorButtonRight:
                                    rightButton = item as SVGGElement;
                                    break;
                                case cssConnectorButtonLeft:
                                    leftButton = item as SVGGElement;
                                    break;
                                case cssConnectorButtonTop:
                                    topButton = item as SVGGElement;
                                    break;
                                case cssConnectorButtonBottom:
                                    bottomButton = item as SVGGElement;
                                    break;
                            }
                        }

                        if (connector) {
                            this.connectors[cid] = {
                                id: cid,
                                connector,
                                rightButton,
                                leftButton,
                                topButton,
                                bottomButton,
                                targetOffset: 0
                            };
                        }
                    }
                }

                const storageConnectors = svgRoot.getElementsByClassName(cssStorageConnector);
                for (let i = 0; i < storageConnectors.length; i++) {
                    const connectorGroup = storageConnectors[i] as SVGGElement;

                    const id = connectorGroup.getAttribute("id");
                    if (!id) continue;
                    const nodeId = connectorGroup.getAttribute("nodeId");
                    if (!nodeId) continue;
                    const storageNodeId = connectorGroup.getAttribute("storageNodeId");
                    if (!storageNodeId) continue;
                    let connector: SVGPathElement | null = null;
                    let icon: SVGGElement | undefined = undefined;

                    for (let j = 0; j < connectorGroup.children.length; j++) {
                        const item = connectorGroup.children[j] as SVGElement;

                        switch (item.tagName.toLowerCase()) {
                            case "path":
                                connector = item as SVGPathElement;
                                break;
                            case "g":
                                icon = item as SVGGElement;
                                break;
                        }
                    }
                    if (connector && icon) {
                        this.storageConnectors[id] = {
                            id,
                            nodeId,
                            storageNodeId,
                            connector,
                            icon
                        };
                    }
                }
            }
        }
    }
    //#endregion INITIALIZE

    //#region SCROLLING                                                             //

    scrollToPanel(mode: string, h: number = 0, complete?: () => void) {

        if (this.viewElement && this.storageElement) {

            let scrollPosition = 0;

            switch (mode) {
                case "storage":
                    scrollPosition = this.storagePanelLeft() - (this.viewElement.clientWidth - this.storageElement.scrollWidth);
                    break;
                case "query":
                    scrollPosition = this.queryPanelLeft();
                    break;
                case "index":
                    scrollPosition = this.indexPanelLeft();
                    break;
                case "plan":
                default:
                    scrollPosition = 0;
                    break;
            }

            var myAnimation = (<any>window).anime({
                targets: this.viewElement,
                scrollLeft: scrollPosition,
                scrollTop: h,
                duration: animationDuration,
                easing: animationEasing,
                complete: complete
            });
        }
    }


    scrolling: boolean = false;

    onScroll() {
        if (!this.scrolling) {
            window.requestAnimationFrame((t) => {
                this.doScroll();
                this.scrolling = false;
            });
            this.scrolling = true;
        }
    }
    doScroll() {
        const { left, top } = this.repositionConnectorButtons();

        this.plan.updateNodeViewMetadata({
            scale: null,
            scrollLeft: left,
            scrollTop: top,
            showInfo: null
        });
    }


    //#endregion SCROLLING

    //#region ZOOM                                                                  
    onBrowserZoom() {
        this.updateLayout();
    }
    //#endregion

    //#region SCALE

    setScale(mode: string, newScale?: number, cb?: () => void) {

        let newValue = (newScale === undefined) ? this.scale() : newScale;

        switch (mode) {
            case "wheel": {

                let current = this.scale();

                current -= newValue / 200.0;
                if (current > 10) {
                    current = 10;
                }
                if (current <= 0.001) {
                    current = 0.001;
                }

                newValue = current;
                break;
            }

            case 'zoomOut': {
                let current = Math.round(this.scale() * 100.0);
                current = Math.round(current - (current % 5.0)) / 100.0;
                current -= 0.05;
                if (current <= 0.001) {
                    current = 0.001;
                }
                newValue = current;
                break;
            }

            case 'zoomIn': {
                let current = Math.round(this.scale() * 100.0);
                current = Math.round(current - (current % 5.0)) / 100.0;
                current += 0.05;
                newValue = current;
                break;
            }

            case 'reset':
                newValue = 1.0;
                break;

            case 'fit':
                if (!this.viewElement) return;
                newValue = (this.viewElement.clientWidth / this.storagePanelLeft()) * this.scale();
                if (newValue > 1) {
                    return;
                }
                break;
        }

        this.scale(newValue);
        this.updateLayout(cb);
    }



    //#endregion SCALE

    //#region SELECT
    selectNode(nodeId: string) {
        if (!this.viewElement) {
            return;
        }

        const layoutStyle = this.viewElement.style;
        if (!layoutStyle) {
            return;
        }

        const nodeElement = document.getElementById(nodeId);
        if (nodeElement === null) return;


        const nodeLeft = getInt(nodeElement.style.left);
        const nodeTop = getInt(nodeElement.style.top);

        // const layoutLeft = parseInt(layoutStyle.left.substring(0, layoutStyle.left.length - 2));
        // const layoutTop = parseInt(layoutStyle.top.substring(0, layoutStyle.top.length - 2));
        // const startLeft = this.viewElement.scrollLeft;
        // const startTop = this.viewElement.scrollTop;

        let scrollLeft = nodeLeft - this.viewElement.offsetWidth / 2 + nodeElement.offsetWidth / 2;
        let scrollTop = nodeTop - this.viewElement.offsetHeight / 2 + nodeElement.offsetHeight / 2;

        if (scrollLeft < 0) {
            scrollLeft = 0;
        }
        if (scrollTop < 0) {
            scrollTop = 0;
        }

        const mainSection = nodeElement.getElementsByClassName(cssNodeMain);

        var myAnimation = (<any>window).anime({
            targets: this.viewElement,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            duration: animationDuration,
            easing: animationEasing,
            complete: () => {
                if (mainSection && mainSection.length > 0) {
                    const mainSectionElement = mainSection[0] as HTMLElement;
                    mainSectionElement.style.border = "1px dashed #4b6592";
                    window.setInterval(() => { mainSectionElement.style.border = ""; }, 3000);
                }
            }
        });


        function getInt(intStringWithMetric: string | null) {
            if (!intStringWithMetric) {
                return 0;
            }
            return parseInt(intStringWithMetric.substring(0, intStringWithMetric.length - 2));
        }

    }

    selectStorageNode(storageNodeId: string): any {

        const nodeElement = document.getElementById(storageNodeId);
        if (nodeElement === null) return;
        if (!this.viewElement) return;
        if (!this.drawingsElement) return;

        const viewRect = this.viewElement.getBoundingClientRect();
        const nodeRect = nodeElement.getBoundingClientRect();
        const drawRect = this.drawingsElement.getBoundingClientRect();

        let scrollTop = (nodeRect.top - drawRect.top) - viewRect.height / 2 + nodeRect.height / 2;

        if (scrollTop < 0) {
            scrollTop = 0;
        }

        // nodeElement
        this.scrollToPanel("storage", scrollTop, () => {

            const parent = nodeElement.parentElement;
            if (parent) {
                parent.style.border = "1px dashed #4b6592";
                window.setInterval(() => { parent.style.border = ""; }, 3000);
            }
        });

    }

    selectNodes(context: { leftNode: string, rightNode: string, storageNode: string }, x: number, y: number) {

        if (this.viewElement && this.drawingsElement) {

            const viewRect = this.viewElement.getBoundingClientRect();
            const drawRect = this.drawingsElement.getBoundingClientRect();

            let maxDist: number = 0;
            let maxHandler;


            if (context.leftNode) {
                const leftElement = document.getElementById(context.leftNode);
                if (leftElement) {

                    let ex = leftElement.offsetLeft + leftElement.offsetWidth - x;
                    let ey = leftElement.offsetTop + leftElement.offsetHeight - y;

                    const dist = Math.sqrt(ex * ex + ey * ey);
                    if (dist > maxDist) {
                        maxDist = dist;
                        maxHandler = () => {
                            this.selectNode(context.leftNode);
                        };
                    }
                }
            }

            if (context.rightNode) {
                const rightElement = document.getElementById(context.rightNode);
                if (rightElement) {
                    const rect = rightElement.getBoundingClientRect();

                    let ex = rightElement.offsetLeft - x;
                    let ey = rightElement.offsetTop - y;

                    const dist = Math.sqrt(ex * ex + ey * ey);
                    if (dist > maxDist) {
                        maxDist = dist;
                        maxHandler = () => {
                            this.selectNode(context.rightNode);
                        };
                    }
                }
            }

            if (context.storageNode) {
                const storageElement = document.getElementById(context.storageNode);
                if (storageElement) {
                    const rect = storageElement.getBoundingClientRect();

                    let ex = storageElement.offsetLeft - x;
                    let ey = storageElement.offsetTop - y;

                    const dist = Math.sqrt(ex * ex + ey * ey);
                    if (dist > maxDist) {
                        maxDist = dist;
                        maxHandler = () => {
                            this.selectStorageNode(context.storageNode);
                        };
                    }
                }
            }

            if (maxHandler) {
                maxHandler();
            }
        }
    }


    //#endregion

    //#region UPDATE LAYOUT

    private updateLayoutNodesPanel(cb: (columnPosition: number, rowPosition: number) => void) {
        window.requestAnimationFrame(() => {

            if (this.statementsElement && this.nodesElement) {

                const statementsPosition = 0;
                const nodesPosition = statementsPosition +
                    this.statementsElement.offsetWidth +
                    getConnectorsPadding(this.statementsConnectorsCount);

                this.nodesPanelLeft(nodesPosition);

                let columnPosition = nodesPosition;
                for (const column of this.layoutColumns) {
                    if (column) {
                        columnPosition = column.measureLayout(columnPosition);
                        column.updateLayout();
                    }
                }

                let rowPosition = verticalMargin;
                for (const row of this.layoutRows) {
                    if (row) {
                        rowPosition = row.measureLayout(rowPosition);
                        row.updateLayout();
                    }
                }
                this.nodesElement.style.visibility = null;

                cb(columnPosition, rowPosition);
            }

        });
    }
    private updateLayoutStoragePanel(columnPosition: number, rowPosition: number, cb: (columnPosition: number, rowPosition: number) => void) {
        const storagePosition = columnPosition +
            horizontalMargin +
            Object.keys(this.storageNodes).length *
            storageConnectorMargin;

        if (this.storageElement) {
            this.storageElement.style.left = storagePosition + "px";
            this.storagePanelLeft(storagePosition);

            const bounds = this.storageElement.getBoundingClientRect();

            columnPosition = storagePosition + bounds.width;
            rowPosition = Math.max(rowPosition, bounds.height);
            this.storageElement.style.visibility = null;
        } else {
            this.storagePanelLeft(0);
        }

        cb(columnPosition, rowPosition);
    }
    private updateLayoutQueryPanel(columnPosition: number, rowPosition: number, cb: (columnPosition: number, rowPosition: number) => void) {
        const queryPosition = columnPosition + horizontalMargin;
        if (this.queryElement) {
            this.queryElement.style.left = queryPosition + "px";
            this.queryPanelLeft(queryPosition);

            const bounds = this.queryElement.getBoundingClientRect();

            columnPosition = queryPosition + bounds.width;
            rowPosition = Math.max(rowPosition, bounds.height);
            this.queryElement.style.visibility = null;

        } else {
            this.queryPanelLeft(0);
        }
        cb(columnPosition, rowPosition);
    }
    private updateLayoutIndexPanel(columnPosition: number, rowPosition: number, cb: (columnPosition: number, rowPosition: number) => void) {
        const indexPosition = columnPosition + horizontalMargin;
        if (this.indexElement) {
            this.indexElement.style.left = indexPosition + "px";
            this.indexPanelLeft(indexPosition);

            const bounds = this.indexElement.getBoundingClientRect();

            columnPosition = indexPosition + bounds.width;
            rowPosition = Math.max(rowPosition, bounds.height);
            this.indexElement.style.visibility = null;

        } else {
            this.indexPanelLeft(0);
        }

        cb(columnPosition, rowPosition);
    }
    private updateLayoutFinalizePanels(columnPosition: number, rowPosition: number, cb: (columnPosition: number, rowPosition: number) => void) {
        if (this.drawingsElement) {
            if (this.storageElement) {
                this.storageElement.style.height = rowPosition + "px";
            }

            if (this.queryElement) {
                this.queryElement.style.height = rowPosition + "px";
            }

            if (this.indexElement) {
                this.indexElement.style.height = rowPosition + "px";
            }

            rowPosition += verticalMargin;
            columnPosition += horizontalMargin;

            // resizing canvas
            this.drawingsElement.style.width = columnPosition + "px";
            this.drawingsElement.style.height = rowPosition + "px";
        }
        cb(columnPosition, rowPosition);
    }
    private updateLayoutConnectors() {
        if (!this.drawingsElement) return;
        const drawRect = this.drawingsElement.getBoundingClientRect();

        //resizing connectors
        for (const cid in this.connectors) {
            if (this.connectors.hasOwnProperty(cid)) {
                const connector = this.connectors[cid];

                if (connector.targetElement && connector.sourceElement && connector.sourceNode) {

                    const targetRect = connector.targetElement.getBoundingClientRect();
                    const targetLeft = (targetRect.right - drawRect.left) + connectorBaseSize;//to accomodate marker
                    let targetTop = (targetRect.top - drawRect.top) + targetRect.height / 2.0;

                    const sourceRect = connector.sourceElement.getBoundingClientRect();
                    const sourceLeft = connector.sourceNode.left;
                    const sourceTop = (sourceRect.top - drawRect.top) + sourceRect.height / 2.0;

                    if (Math.abs(sourceTop - targetTop) <= 5) {

                        const top = (sourceTop + targetTop) / 2;

                        const points = `${sourceLeft},${top} ${targetLeft},${top}`;
                        connector.connector.setAttribute("points", points);
                    } else {
                        const targetOffset = targetLeft + connector.targetOffset * connectorBaseSize;
                        const points = `${sourceLeft},${sourceTop} ${targetOffset},${sourceTop} ${targetOffset},${targetTop} ${targetLeft},${targetTop}`;
                        connector.connector.setAttribute("points", points);
                    }
                }
            }
        }
    }
    private updateLayoutStorageConnectors(graphRight: number) {
        if (!this.drawingsElement) return;
        const drawRect = this.drawingsElement.getBoundingClientRect();
        for (const cid in this.storageConnectors) {
            if (this.storageConnectors.hasOwnProperty(cid)) {
                const connector = this.storageConnectors[cid];
                const node = connector.node;


                const storageNode = (!connector.storageNodeElement)
                    ? (connector.storageNodeElement = document.getElementById(connector.storageNodeId))
                    : connector.storageNodeElement;

                // move database icon
                if (node && node.element && storageNode && connector.icon) {
                    const nodeRect = node.element.getBoundingClientRect();
                    const storageNodeRect = storageNode.getBoundingClientRect();

                    let iconRect = connector.icon.getBoundingClientRect();

                    if (connector.node && connector.node.isDataWrite) {
                        connector.icon.setAttribute("transform", `translate(${node.left - iconRect.width - 2},${node.top + 40})`);
                        iconRect = connector.icon.getBoundingClientRect();

                        const startLeft = (iconRect.left - drawRect.left) + iconRect.width / 2;
                        const startTop = (iconRect.top - drawRect.top);

                        const endLeft = (storageNodeRect.left - drawRect.left) - connectorBaseSize * 2;
                        const endTop = (storageNodeRect.top - drawRect.top) + storageNodeRect.height / 2.0;

                        const relG = graphRight - startLeft;
                        const bzPoint = (graphRight + endLeft) / 2;

                        const vOffset = (this.layoutRows[node.row].dataWriteCount - node.dataWriteIndex) * 4;

                        const points = `M${startLeft},${startTop} l0,-${40 + vOffset} l${relG + vOffset},0 C${bzPoint},${startTop - 40 - vOffset} ${bzPoint},${endTop} ${endLeft - 10},${endTop} l10,0`;


                        connector.connector.setAttribute("d", points);


                    } else {

                        connector.icon.setAttribute("transform", `translate(${node.left + node.width + 2},${node.top + 40})`);
                        iconRect = connector.icon.getBoundingClientRect();

                        const startLeft = (storageNodeRect.left - drawRect.left);
                        const startTop = (storageNodeRect.top - drawRect.top) + storageNodeRect.height / 2.0;

                        const endLeft = (iconRect.right - drawRect.left) + connectorBaseSize;
                        const endTop = (iconRect.top - drawRect.top) + iconRect.height / 2.0;

                        const bzPoint = (startLeft + endLeft) / 2;


                        const points = `M${startLeft},${startTop} l-10,0 C${bzPoint},${startTop} ${bzPoint},${endTop} ${endLeft + 10},${endTop} l-10,0`;

                        connector.connector.setAttribute("d", points);

                    }
                }
            }
        }
    }

    private repositionConnectorButtons() {
        const element = this.viewElement;
        if (element) {
            // reposition navigation buttons
            const left = element.scrollLeft + connectorBaseSize;
            const top = element.scrollTop + connectorBaseSize;
            const right = left + element.offsetWidth;
            const bottom = top + element.offsetHeight;

            const connectors = this.connectors;
            for (const id in connectors) {
                if (connectors.hasOwnProperty(id)) {
                    updateConnectorLayout(connectors[id], left, top, right, bottom);
                }
            }

            return { left: element.scrollLeft, top: element.scrollTop };
        }
        else {
            return { left: 0, top: 0 };
        }
        function updateConnectorLayout(connector: Connector, left: number, top: number, right: number, bottom: number) {
            if (connector.leftButton != null && connector.rightButton != null && connector.connector.points.numberOfItems > 0) {
                const pointRight = connector.connector.points.getItem(0);
                if (pointRight.y >= top && pointRight.y <= bottom && connector.connector.points.numberOfItems > 1) {
                    const pointLeft = connector.connector.points.getItem(1);
                    positionConnectorRight(connector.rightButton, pointRight.y, pointLeft.x, pointRight.x, left, right);
                    positionConnectorLeft(connector.leftButton, pointRight.y, pointLeft.x, pointRight.x, left, right);
                }
            }

            if (connector.topButton != null && connector.bottomButton != null && connector.connector.points.numberOfItems > 1) {
                const pointBottom = connector.connector.points.getItem(1);
                if (pointBottom.x >= left && pointBottom.x <= right && connector.connector.points.numberOfItems > 2) {
                    const pointTop = connector.connector.points.getItem(2);
                    positionConnectorBottom(connector.bottomButton, pointBottom.x, pointTop.y, pointBottom.y, top, bottom);
                    positionConnectorTop(connector.topButton, pointBottom.x, pointTop.y, pointBottom.y, top, bottom);
                }
            }
        }
        function positionConnectorLeft(button: SVGGElement | null, lineY: number, lineLeft: number, lineRight: number, viewLeft: number, viewRight: number) {
            if (button) {
                if (lineLeft <= viewRight && lineLeft < viewLeft && (lineRight - 30) > viewLeft) {

                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${viewLeft},${lineY - 10})`);
                } else {
                    button.style.display = "none";
                }
            }
        }

        function positionConnectorTop(button: SVGGElement | null, lineX: number, lineTop: number, lineBottom: number, viewTop: number, viewBottom: number) {
            if (button) {
                if (lineTop <= viewBottom && lineTop < viewTop && (lineBottom - 30) > viewTop) {

                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${lineX - 10}, ${viewTop})`);
                } else {
                    button.style.display = "none";
                }
            }
        }

        function positionConnectorRight(button: SVGGElement | null, lineY: number, lineLeft: number, lineRight: number, viewLeft: number, viewRight: number) {
            if (button) {
                if (lineRight >= viewLeft && lineRight > viewRight && (lineLeft + 50) < viewRight) {

                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${viewRight - 40},${lineY - 10})`);
                } else {
                    button.style.display = "none";
                }
            }
        }
        function positionConnectorBottom(button: SVGGElement | null, lineX: number, lineTop: number, lineBottom: number, viewTop: number, viewBottom: number) {
            if (button) {
                if (lineBottom >= viewTop && lineBottom > viewBottom && (lineTop + 50) < viewBottom) {

                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${lineX - 10},${viewBottom - 40})`);
                } else {
                    button.style.display = "none";
                }
            }
        }
    }

    updateLayout(cb?: () => void) {

        this.updateLayoutNodesPanel((columnPosition, rowPosition) => {

            const graphRight = columnPosition;

            this.updateLayoutStoragePanel(columnPosition, rowPosition, (columnPosition: number, rowPosition: number) => {

                this.updateLayoutQueryPanel(columnPosition, rowPosition, (columnPosition: number, rowPosition: number) => {

                    this.updateLayoutIndexPanel(columnPosition, rowPosition, (columnPosition: number, rowPosition: number) => {

                        this.updateLayoutFinalizePanels(columnPosition, rowPosition, (columnPosition: number, rowPosition: number) => {

                            this.updateLayoutConnectors()

                            this.repositionConnectorButtons();

                            this.updateLayoutStorageConnectors(graphRight);

                            if (cb) {
                                cb();
                            }

                        });
                    });
                });
            });
        });
    }

    //#endregion

    afterRender = () => {
        window.requestAnimationFrame(() => {
            this.postRenderInitialize();
        });
    }

    getNode(nodeId?: string) {
        if (nodeId) {
            let node = this.layoutNodes[nodeId];
            if (!node) {
                node = this.statementNodes[nodeId];
            }
            return node;
        }
    }

    get viewport(): ClientRect {
        if (this.viewElement) {
            const element = this.viewElement;
            return new Rect(element.scrollLeft, element.scrollTop, element.scrollLeft + element.offsetWidth, element.scrollTop + element.offsetHeight);
        }
        throw new Error("viewElement is missing");
    }

    private getElementByClass<T extends Element>(className: string, element?: HTMLElement): T {
        if (!element) {
            element = this.viewElement;
        }
        if (element) {
            const nodes = element.getElementsByClassName(className);
            if (nodes && nodes.length > 0) {
                return nodes[0] as T;
            }
        }
        throw new Error(`Can't find element #${className} on element ${element}`);
    }
    private getElementByClassIfExists<T extends Element>(className: string, element?: HTMLElement): T | undefined {
        if (!element) {
            element = this.viewElement;
        }
        if (element) {
            const nodes = element.getElementsByClassName(className);
            if (nodes && nodes.length > 0) {
                return nodes[0] as T;
            }
        }
    }

    // private getSvgElement(tag: string, parentElement: Element): SVGElement {
    //     const pathElementSet = parentElement.getElementsByTagNameNS("http://www.w3.org/2000/svg", "tag");
    //     if (pathElementSet && pathElementSet.length > 0) {
    //         return pathElementSet.item(0);
    //     }
    //     return null;
    // }
}

export interface Connector {
    id: string;
    targetOffset: number;
    targetElement?: HTMLElement;
    sourceElement?: HTMLElement;
    sourceNode?: LayoutNode;
    targetNode?: LayoutNode;
    targetId?: string;
    sourceId?: string;
    bottomButton?: SVGGElement;
    topButton?: SVGGElement;
    rightButton?: SVGGElement;
    leftButton?: SVGGElement;
    connector: SVGPolylineElement;
}

interface StorageConnector {

    id: string;
    nodeId: string;
    storageNodeId: string;
    storageNodeElement?: HTMLElement | null;
    node?: LayoutNode;
    icon: SVGGElement;
    connector: SVGPathElement;
}

const cssCanvas = "join-manual";
const cssNodeMain = "join-node-main";
const cssNodes = "join-nodes";
const cssNodeCost = "join-node-cost";
const cssNodeIncoming = "join-node-incoming-item";
const cssStatements = "smt-list";

const cssQuerytext = "join-querytext";
const cssIndextext = "join-indextext";
const cssStorage = "join-storage";

const cssDrawings = "join-drawings";
//const cssNodeStatements = "join-node-statements";

const animationEasing = "easeOutCirc";
const animationDuration = 750;

const cssConnectionGroup = "join-connector-group";
const cssConnectorButtonBottom = "join-connector-button join-connector-bottom";
const cssConnectorButtonLeft = "join-connector-button join-connector-left";
const cssConnectorButtonRight = "join-connector-button join-connector-right";
const cssConnectorButtonTop = "join-connector-button join-connector-top";
const cssConnectorPath = "join-connector-path";
const cssSvgRoot = "join-drawings";

const cssStorageConnector = "st-connector";
