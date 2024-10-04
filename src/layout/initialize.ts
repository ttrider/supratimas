import { LayoutManager } from "./layout";
import { AppPlan } from "../app/plan";
import { NodeSelector } from "./nodeSelector";
import * as formatterModule from "../sqlplan/formatter";
import { enableMouseScroll } from "./layoutScroll";
import { enableMouseZoom } from "./layoutZoom";
import { AppStatement } from "../app/statement";

export default function initialize() {

    ko.bindingHandlers.initLayout = {
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const context = <any>bindingContext;
            let layoutManager = context.layoutManager as LayoutManager;
            if (!layoutManager) {
                layoutManager = new LayoutManager(valueAccessor() as AppPlan);
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
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {

            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;
            layoutManager.initializeViewModel(element, valueAccessor());

            element.appendChild(document.createComment("ko template: { afterRender: layoutManager.afterRender }"));
            element.appendChild(document.createComment("afterRender handler"));
            element.appendChild(document.createComment("/ko"));


            enableMouseScroll(element);
            enableMouseZoom(element, layoutManager);
        }
    };

    ko.bindingHandlers.clickToSelectNode = {
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;

            const info = valueAccessor();

            (<any>bindingContext).nodeSelector = new NodeSelector(layoutManager, element, info);
        },
    };

    ko.bindingHandlers.clickToSelectStorageNode = {
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;

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
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;

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
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;

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
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;

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
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;

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
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;
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

            function setValueText(value: number) {
                let p = value * 100.0;
                if (p < 1.0) {
                    el.innerText = (Math.round(p * 100.0) / 100.0) + "%";
                } else {
                    el.innerText = Math.round(p) + "%";
                }
            }
        },
    };

    ko.bindingHandlers.statementCommandClick = {
        init: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {

            const layoutManager = (<any>bindingContext).layoutManager as LayoutManager;
            const statement = (<any>bindingContext).$data.statement as AppStatement;


            element.addEventListener("click", (ev) => {
                ev.cancelBubble = true;
                ev.stopPropagation();
                ev.preventDefault();

                layoutManager.plan.statementCommandHandler(statement);

            });
        }
    }
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

