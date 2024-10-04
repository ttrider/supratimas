"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layout_1 = require("./layout");
const nodeSelector_1 = require("./nodeSelector");
const formatterModule = require("../sqlplan/formatter");
const layoutScroll_1 = require("./layoutScroll");
const layoutZoom_1 = require("./layoutZoom");
function initialize() {
    ko.bindingHandlers.initLayout = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const context = bindingContext;
            let layoutManager = context.layoutManager;
            if (!layoutManager) {
                layoutManager = new layout_1.LayoutManager(valueAccessor());
                context.layoutManager = layoutManager;
                context.formatter = formatterModule;
                context.nodeView = layoutManager.plan.nodeView;
                context.statementCommandName = layoutManager.plan.statementCommandName;
                context.statementCommandHandler = layoutManager.plan.statementCommandHandler;
                context.isAddToWorkspace = !!layoutManager.plan.addToWorkspaceHandler;
            }
        }
    };
    ko.bindingHandlers.viewLayout = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            layoutManager.initializeViewModel(element, valueAccessor());
            element.appendChild(document.createComment("ko template: { afterRender: layoutManager.afterRender }"));
            element.appendChild(document.createComment("afterRender handler"));
            element.appendChild(document.createComment("/ko"));
            layoutScroll_1.enableMouseScroll(element);
            layoutZoom_1.enableMouseZoom(element, layoutManager);
        }
    };
    ko.bindingHandlers.clickToSelectNode = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const info = valueAccessor();
            bindingContext.nodeSelector = new nodeSelector_1.NodeSelector(layoutManager, element, info);
        },
    };
    ko.bindingHandlers.clickToSelectStorageNode = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const storageNodeId = valueAccessor();
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                layoutManager.selectStorageNode(storageNodeId);
            });
        },
    };
    ko.bindingHandlers.clickToSelectNodes = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const context = valueAccessor();
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                layoutManager.selectNodes(context, ev.offsetX, ev.offsetY);
            });
            element.addEventListener("mousemove", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
            });
            element.addEventListener("mouseover", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
            });
            element.addEventListener("mouseout", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
            });
        },
    };
    ko.bindingHandlers.clickToZoomAndSelectNode = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const nodeId = valueAccessor();
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                layoutManager.setScale("reset");
                layoutManager.selectNode(nodeId);
            });
        },
    };
    ko.bindingHandlers.clickToScrollToPanel = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const mode = valueAccessor();
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                layoutManager.scrollToPanel(mode);
            });
        },
    };
    ko.bindingHandlers.clickAddToWorkspace = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const mode = valueAccessor();
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                if (layoutManager.plan.addToWorkspaceHandler) {
                    layoutManager.plan.addToWorkspaceHandler();
                }
            });
        },
    };
    ko.bindingHandlers.clickToZoom = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const el = element;
            const mode = valueAccessor();
            if (mode === 'reset') {
                layoutManager.scale.subscribe((value) => {
                    setValueText(value);
                });
                setValueText(layoutManager.scale());
            }
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                layoutManager.setScale(mode);
            });
            function setValueText(value) {
                let p = value * 100.0;
                if (p < 1.0) {
                    el.innerText = (Math.round(p * 100.0) / 100.0) + "%";
                }
                else {
                    el.innerText = Math.round(p) + "%";
                }
            }
        },
    };
    ko.bindingHandlers.statementCommandClick = {
        init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = bindingContext.layoutManager;
            const statement = bindingContext.$data.statement;
            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();
                layoutManager.plan.statementCommandHandler(statement);
            });
        }
    };
    // ko.bindingHandlers.infoBar = {
    //     init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
    //         const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;
    //         const mode = valueAccessor();
    //         element.addEventListener("click", (ev) => {
    //             ev.cancelBubble = true;
    //             ev.stopPropagation();
    //             ev.preventDefault();
    //             layoutManager.scrollToPanel(mode);
    //         });
    //     },
    // };
}
exports.default = initialize;
//# sourceMappingURL=initialize.js.map