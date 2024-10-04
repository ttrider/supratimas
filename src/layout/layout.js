"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../common/util");
const layoutNode_1 = require("./layoutNode");
const layoutColumn_1 = require("./layoutColumn");
const layoutRow_1 = require("./layoutRow");
class LayoutManager {
    //#region INITIALIZE
    constructor(plan) {
        this.plan = plan;
        this.viewModel = ko.observable();
        this.storageConnectors = {};
        this.connectors = {};
        this.statementsConnectorsCount = 0;
        this.layoutMatrix = [];
        this.layoutColumns = [];
        this.layoutRows = [];
        this.layoutNodes = {};
        this.storageNodes = {};
        this.statementNodes = {};
        this.previewNode = new layoutNode_1.LayoutNodePreview();
        this.statementsPanelLeft = ko.observable(0);
        this.nodesPanelLeft = ko.observable(0);
        this.storagePanelLeft = ko.observable(0);
        this.queryPanelLeft = ko.observable(0);
        this.indexPanelLeft = ko.observable(0);
        this.scale = ko.observable(1);
        this.iconScale = ko.pureComputed(() => {
            const sc = this.scale();
            let compensateScale = 1 / sc;
            return compensateScale + "em";
        });
        this.noteTemplate = ko.pureComputed(() => {
            return "plan-node-info-template";
        });
        this.scrolling = false;
        //#endregion
        this.afterRender = () => {
            window.requestAnimationFrame(() => {
                this.postRenderInitialize();
            });
        };
        this.scale = ko.observable(this.plan.nodeViewMetadata.scale);
        this.scale.subscribe((val) => {
            this.plan.updateNodeViewMetadata({
                scale: val,
                scrollLeft: null,
                scrollTop: null,
                showInfo: null
            });
        });
    }
    initializeViewModel(viewElement, viewModel) {
        this.viewElement = viewElement;
        this.viewModel = viewModel;
        viewElement.addEventListener("scroll", () => { this.onScroll(); });
        viewElement.addEventListener("zoom", () => { this.onBrowserZoom(); });
        return this;
    }
    postRenderInitialize() {
        // collect imporatant elements
        this.canvasElement = this.getElementByClass(cssCanvas);
        this.drawingsElement = this.getElementByClass(cssDrawings);
        this.nodesElement = this.getElementByClass(cssNodes);
        this.statementsElement = this.getElementByClass(cssStatements);
        this.storageElement = this.getElementByClass(cssStorage);
        this.queryElement = this.getElementByClassIfExists(cssQuerytext);
        this.indexElement = this.getElementByClassIfExists(cssIndextext);
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
    initializeStatementsLayout() {
        this.statementsConnectorsCount = 0;
        if (this.statementsElement) {
            for (let i = 0; i < this.statementsElement.children.length; i++) {
                let element = this.statementsElement.children[i];
                if (element.tagName.toLowerCase() !== "section") {
                    const layoutNode = new layoutNode_1.LayoutNode(element);
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
    initializeNodesLayout() {
        if (this.nodesElement) {
            // reset connector count
            for (const column of this.layoutColumns) {
                if (column) {
                    column.connectors = 0;
                }
            }
            for (let i = 0; i < this.nodesElement.children.length; i++) {
                const element = this.nodesElement.children[i];
                const layoutNode = new layoutNode_1.LayoutNode(element);
                const layoutColumn = util_1.getOrAdd(this.layoutColumns, layoutNode.column, () => new layoutColumn_1.LayoutColumn());
                const layoutRow = util_1.getOrAdd(this.layoutRows, layoutNode.row, () => new layoutRow_1.LayoutRow());
                layoutColumn.nodes.push(layoutNode);
                layoutRow.nodes.push(layoutNode);
                util_1.getOrAdd(util_1.getOrAdd(this.layoutMatrix, layoutNode.column, () => []), layoutNode.row, () => layoutNode);
                layoutNode.outgoingElement = this.getElementByClass(cssNodeCost, element);
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
    reconcileConnectors() {
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
    initializeIncomingConnectors(layoutNode, baseOffset = 0) {
        const incomingElements = layoutNode.element.getElementsByClassName(cssNodeIncoming);
        const incomingItems = layoutNode.node.children;
        const max = Math.min(incomingElements.length, layoutNode.node.children.length);
        for (let i = 0; i < max; i++) {
            const incomingElement = incomingElements.item(i);
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
    initializeConnectorLayout() {
        if (this.viewElement) {
            const roots = this.viewElement.getElementsByClassName(cssSvgRoot);
            if (roots && roots.length > 0) {
                const svgRoot = roots[0];
                const connectors = svgRoot.getElementsByClassName(cssConnectionGroup);
                for (let i = 0; i < connectors.length; i++) {
                    const connectorGroup = connectors[i];
                    const cid = connectorGroup.getAttribute("id");
                    if (cid) {
                        let connector = undefined;
                        let rightButton = undefined;
                        let leftButton = undefined;
                        let topButton = undefined;
                        let bottomButton = undefined;
                        for (let j = 0; j < connectorGroup.children.length; j++) {
                            const item = connectorGroup.children[j];
                            switch (item.className.baseVal) {
                                case cssConnectorPath:
                                    connector = item;
                                    break;
                                case cssConnectorButtonRight:
                                    rightButton = item;
                                    break;
                                case cssConnectorButtonLeft:
                                    leftButton = item;
                                    break;
                                case cssConnectorButtonTop:
                                    topButton = item;
                                    break;
                                case cssConnectorButtonBottom:
                                    bottomButton = item;
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
                    const connectorGroup = storageConnectors[i];
                    const id = connectorGroup.getAttribute("id");
                    if (!id)
                        continue;
                    const nodeId = connectorGroup.getAttribute("nodeId");
                    if (!nodeId)
                        continue;
                    const storageNodeId = connectorGroup.getAttribute("storageNodeId");
                    if (!storageNodeId)
                        continue;
                    let connector = null;
                    let icon = undefined;
                    for (let j = 0; j < connectorGroup.children.length; j++) {
                        const item = connectorGroup.children[j];
                        switch (item.tagName.toLowerCase()) {
                            case "path":
                                connector = item;
                                break;
                            case "g":
                                icon = item;
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
    scrollToPanel(mode, h = 0, complete) {
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
            var myAnimation = window.anime({
                targets: this.viewElement,
                scrollLeft: scrollPosition,
                scrollTop: h,
                duration: animationDuration,
                easing: animationEasing,
                complete: complete
            });
        }
    }
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
    setScale(mode, newScale, cb) {
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
                if (!this.viewElement)
                    return;
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
    selectNode(nodeId) {
        if (!this.viewElement) {
            return;
        }
        const layoutStyle = this.viewElement.style;
        if (!layoutStyle) {
            return;
        }
        const nodeElement = document.getElementById(nodeId);
        if (nodeElement === null)
            return;
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
        var myAnimation = window.anime({
            targets: this.viewElement,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            duration: animationDuration,
            easing: animationEasing,
            complete: () => {
                if (mainSection && mainSection.length > 0) {
                    const mainSectionElement = mainSection[0];
                    mainSectionElement.style.border = "1px dashed #4b6592";
                    window.setInterval(() => { mainSectionElement.style.border = ""; }, 3000);
                }
            }
        });
        function getInt(intStringWithMetric) {
            if (!intStringWithMetric) {
                return 0;
            }
            return parseInt(intStringWithMetric.substring(0, intStringWithMetric.length - 2));
        }
    }
    selectStorageNode(storageNodeId) {
        const nodeElement = document.getElementById(storageNodeId);
        if (nodeElement === null)
            return;
        if (!this.viewElement)
            return;
        if (!this.drawingsElement)
            return;
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
    selectNodes(context, x, y) {
        if (this.viewElement && this.drawingsElement) {
            const viewRect = this.viewElement.getBoundingClientRect();
            const drawRect = this.drawingsElement.getBoundingClientRect();
            let maxDist = 0;
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
    updateLayoutNodesPanel(cb) {
        window.requestAnimationFrame(() => {
            if (this.statementsElement && this.nodesElement) {
                const statementsPosition = 0;
                const nodesPosition = statementsPosition +
                    this.statementsElement.offsetWidth +
                    layoutColumn_1.getConnectorsPadding(this.statementsConnectorsCount);
                this.nodesPanelLeft(nodesPosition);
                let columnPosition = nodesPosition;
                for (const column of this.layoutColumns) {
                    if (column) {
                        columnPosition = column.measureLayout(columnPosition);
                        column.updateLayout();
                    }
                }
                let rowPosition = layoutRow_1.verticalMargin;
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
    updateLayoutStoragePanel(columnPosition, rowPosition, cb) {
        const storagePosition = columnPosition +
            layoutColumn_1.horizontalMargin +
            Object.keys(this.storageNodes).length *
                layoutColumn_1.storageConnectorMargin;
        if (this.storageElement) {
            this.storageElement.style.left = storagePosition + "px";
            this.storagePanelLeft(storagePosition);
            const bounds = this.storageElement.getBoundingClientRect();
            columnPosition = storagePosition + bounds.width;
            rowPosition = Math.max(rowPosition, bounds.height);
            this.storageElement.style.visibility = null;
        }
        else {
            this.storagePanelLeft(0);
        }
        cb(columnPosition, rowPosition);
    }
    updateLayoutQueryPanel(columnPosition, rowPosition, cb) {
        const queryPosition = columnPosition + layoutColumn_1.horizontalMargin;
        if (this.queryElement) {
            this.queryElement.style.left = queryPosition + "px";
            this.queryPanelLeft(queryPosition);
            const bounds = this.queryElement.getBoundingClientRect();
            columnPosition = queryPosition + bounds.width;
            rowPosition = Math.max(rowPosition, bounds.height);
            this.queryElement.style.visibility = null;
        }
        else {
            this.queryPanelLeft(0);
        }
        cb(columnPosition, rowPosition);
    }
    updateLayoutIndexPanel(columnPosition, rowPosition, cb) {
        const indexPosition = columnPosition + layoutColumn_1.horizontalMargin;
        if (this.indexElement) {
            this.indexElement.style.left = indexPosition + "px";
            this.indexPanelLeft(indexPosition);
            const bounds = this.indexElement.getBoundingClientRect();
            columnPosition = indexPosition + bounds.width;
            rowPosition = Math.max(rowPosition, bounds.height);
            this.indexElement.style.visibility = null;
        }
        else {
            this.indexPanelLeft(0);
        }
        cb(columnPosition, rowPosition);
    }
    updateLayoutFinalizePanels(columnPosition, rowPosition, cb) {
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
            rowPosition += layoutRow_1.verticalMargin;
            columnPosition += layoutColumn_1.horizontalMargin;
            // resizing canvas
            this.drawingsElement.style.width = columnPosition + "px";
            this.drawingsElement.style.height = rowPosition + "px";
        }
        cb(columnPosition, rowPosition);
    }
    updateLayoutConnectors() {
        if (!this.drawingsElement)
            return;
        const drawRect = this.drawingsElement.getBoundingClientRect();
        //resizing connectors
        for (const cid in this.connectors) {
            if (this.connectors.hasOwnProperty(cid)) {
                const connector = this.connectors[cid];
                if (connector.targetElement && connector.sourceElement && connector.sourceNode) {
                    const targetRect = connector.targetElement.getBoundingClientRect();
                    const targetLeft = (targetRect.right - drawRect.left) + layoutColumn_1.connectorBaseSize; //to accomodate marker
                    let targetTop = (targetRect.top - drawRect.top) + targetRect.height / 2.0;
                    const sourceRect = connector.sourceElement.getBoundingClientRect();
                    const sourceLeft = connector.sourceNode.left;
                    const sourceTop = (sourceRect.top - drawRect.top) + sourceRect.height / 2.0;
                    if (Math.abs(sourceTop - targetTop) <= 5) {
                        const top = (sourceTop + targetTop) / 2;
                        const points = `${sourceLeft},${top} ${targetLeft},${top}`;
                        connector.connector.setAttribute("points", points);
                    }
                    else {
                        const targetOffset = targetLeft + connector.targetOffset * layoutColumn_1.connectorBaseSize;
                        const points = `${sourceLeft},${sourceTop} ${targetOffset},${sourceTop} ${targetOffset},${targetTop} ${targetLeft},${targetTop}`;
                        connector.connector.setAttribute("points", points);
                    }
                }
            }
        }
    }
    updateLayoutStorageConnectors(graphRight) {
        if (!this.drawingsElement)
            return;
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
                        const endLeft = (storageNodeRect.left - drawRect.left) - layoutColumn_1.connectorBaseSize * 2;
                        const endTop = (storageNodeRect.top - drawRect.top) + storageNodeRect.height / 2.0;
                        const relG = graphRight - startLeft;
                        const bzPoint = (graphRight + endLeft) / 2;
                        const vOffset = (this.layoutRows[node.row].dataWriteCount - node.dataWriteIndex) * 4;
                        const points = `M${startLeft},${startTop} l0,-${40 + vOffset} l${relG + vOffset},0 C${bzPoint},${startTop - 40 - vOffset} ${bzPoint},${endTop} ${endLeft - 10},${endTop} l10,0`;
                        connector.connector.setAttribute("d", points);
                    }
                    else {
                        connector.icon.setAttribute("transform", `translate(${node.left + node.width + 2},${node.top + 40})`);
                        iconRect = connector.icon.getBoundingClientRect();
                        const startLeft = (storageNodeRect.left - drawRect.left);
                        const startTop = (storageNodeRect.top - drawRect.top) + storageNodeRect.height / 2.0;
                        const endLeft = (iconRect.right - drawRect.left) + layoutColumn_1.connectorBaseSize;
                        const endTop = (iconRect.top - drawRect.top) + iconRect.height / 2.0;
                        const bzPoint = (startLeft + endLeft) / 2;
                        const points = `M${startLeft},${startTop} l-10,0 C${bzPoint},${startTop} ${bzPoint},${endTop} ${endLeft + 10},${endTop} l-10,0`;
                        connector.connector.setAttribute("d", points);
                    }
                }
            }
        }
    }
    repositionConnectorButtons() {
        const element = this.viewElement;
        if (element) {
            // reposition navigation buttons
            const left = element.scrollLeft + layoutColumn_1.connectorBaseSize;
            const top = element.scrollTop + layoutColumn_1.connectorBaseSize;
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
        function updateConnectorLayout(connector, left, top, right, bottom) {
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
        function positionConnectorLeft(button, lineY, lineLeft, lineRight, viewLeft, viewRight) {
            if (button) {
                if (lineLeft <= viewRight && lineLeft < viewLeft && (lineRight - 30) > viewLeft) {
                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${viewLeft},${lineY - 10})`);
                }
                else {
                    button.style.display = "none";
                }
            }
        }
        function positionConnectorTop(button, lineX, lineTop, lineBottom, viewTop, viewBottom) {
            if (button) {
                if (lineTop <= viewBottom && lineTop < viewTop && (lineBottom - 30) > viewTop) {
                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${lineX - 10}, ${viewTop})`);
                }
                else {
                    button.style.display = "none";
                }
            }
        }
        function positionConnectorRight(button, lineY, lineLeft, lineRight, viewLeft, viewRight) {
            if (button) {
                if (lineRight >= viewLeft && lineRight > viewRight && (lineLeft + 50) < viewRight) {
                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${viewRight - 40},${lineY - 10})`);
                }
                else {
                    button.style.display = "none";
                }
            }
        }
        function positionConnectorBottom(button, lineX, lineTop, lineBottom, viewTop, viewBottom) {
            if (button) {
                if (lineBottom >= viewTop && lineBottom > viewBottom && (lineTop + 50) < viewBottom) {
                    button.style.display = "block";
                    button.setAttribute("transform", `translate(${lineX - 10},${viewBottom - 40})`);
                }
                else {
                    button.style.display = "none";
                }
            }
        }
    }
    updateLayout(cb) {
        this.updateLayoutNodesPanel((columnPosition, rowPosition) => {
            const graphRight = columnPosition;
            this.updateLayoutStoragePanel(columnPosition, rowPosition, (columnPosition, rowPosition) => {
                this.updateLayoutQueryPanel(columnPosition, rowPosition, (columnPosition, rowPosition) => {
                    this.updateLayoutIndexPanel(columnPosition, rowPosition, (columnPosition, rowPosition) => {
                        this.updateLayoutFinalizePanels(columnPosition, rowPosition, (columnPosition, rowPosition) => {
                            this.updateLayoutConnectors();
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
    getNode(nodeId) {
        if (nodeId) {
            let node = this.layoutNodes[nodeId];
            if (!node) {
                node = this.statementNodes[nodeId];
            }
            return node;
        }
    }
    get viewport() {
        if (this.viewElement) {
            const element = this.viewElement;
            return new util_1.Rect(element.scrollLeft, element.scrollTop, element.scrollLeft + element.offsetWidth, element.scrollTop + element.offsetHeight);
        }
        throw new Error("viewElement is missing");
    }
    getElementByClass(className, element) {
        if (!element) {
            element = this.viewElement;
        }
        if (element) {
            const nodes = element.getElementsByClassName(className);
            if (nodes && nodes.length > 0) {
                return nodes[0];
            }
        }
        throw new Error(`Can't find element #${className} on element ${element}`);
    }
    getElementByClassIfExists(className, element) {
        if (!element) {
            element = this.viewElement;
        }
        if (element) {
            const nodes = element.getElementsByClassName(className);
            if (nodes && nodes.length > 0) {
                return nodes[0];
            }
        }
    }
}
exports.LayoutManager = LayoutManager;
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
//# sourceMappingURL=layout.js.map