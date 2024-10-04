import { PlanNode } from "../sqlplan/model";
import { Selector, SelectorItem } from "../common/selector";
import { AppStatement } from "./statement";
import { AppNodeBase, createNode, createStatementNode, AppStatementNode } from './node';
import { AppPlan } from "./plan";
import { LayoutManager } from "../layout/layout";
import { AppNodeViewModel } from "./nodeViewModel";

const cssIndextext = "join-indextext";
const cssManual = "join-manual";
const cssNodeCost = "join-node-cost";
const cssNodeIncoming = "join-node-incoming-item";
const cssNodeMain = "join-node-main";
const cssNodes = "join-nodes";
const cssPlanView = "plan-view";
const cssPlanViewHost = "plan-view-host";
const cssPlanViewWorkarea = "plan-view-action-workarea";
const cssQuerytext = "join-querytext";
const cssStatements = "join-statements";
const cssNodeStatements = "join-node-statements";

const cssStorage = "join-storage";
const cssZoomMap = "zoom-map";



export class NodeView {



    infoBarSelector: Selector<InfoBarSelectorItem>;
    viewModelSelector: Selector<ViewModelSelectorItem>;

    viewModel: KnockoutComputed<AppNodeViewModel>;
    infobarNodes: KnockoutComputed<AppNodeBase[]>;
    infobarVisible: KnockoutObservable<boolean>;

    metadata: NodeViewMeta;
    
    

    emptyViewModel: AppNodeViewModel = new AppNodeViewModel();

    constructor(
        public plan: AppPlan,
        nodeViewMeta: NodeViewMeta,
        public defaultViewModel: AppNodeViewModel = AppNodeViewModel.default,
        public compactViewModel: AppNodeViewModel = AppNodeViewModel.default,
        public joinViewModel: AppNodeViewModel = AppNodeViewModel.default) {


        this.metadata = nodeViewMeta;
        

        this.infobarVisible = ko.observable(this.metadata.showInfo);
        this.infobarVisible.subscribe((newVal) => {

            this.plan.updateNodeViewMetadata({
                scale: null,
                scrollLeft: null,
                scrollTop: null,
                showInfo: newVal
            });

        });


        this.viewModelSelector = new Selector("viewModel", [
            new ViewModelSelectorItem("All", "selector_default", defaultViewModel),
            new ViewModelSelectorItem("Expensive", "selector_compact", compactViewModel),
            new ViewModelSelectorItem("Joins", "selector_join", joinViewModel)
        ]);

        this.viewModel = ko.pureComputed(() => {

            const selected = this.viewModelSelector.selected();
            if (selected) {
                return selected.model;
            }
            return this.emptyViewModel;

        });

        this.infoBarSelector = new Selector("infobar", [
            new InfoBarSelectorItem("expensive", "Expensive", "navigator-expensive-node", ko.pureComputed(() => { return this.viewModel().expensiveNodes; })),
            new InfoBarSelectorItem("data-heavy", "Data-Heavy", "navigator-dataheavy-node", ko.pureComputed(() => { return this.viewModel().bigDataNodes; })),
            new InfoBarSelectorItem("warnings", "Warnings", "navigator-warning-node", ko.pureComputed(() => { return this.viewModel().warningsNodes; })),
        ]);

        this.infobarNodes = ko.pureComputed(() => {

            const selected = this.infoBarSelector.selected();
            if (selected) {
                switch (selected.itemId) {
                    case "none": {
                        return [];
                    }
                    case "expensive": {
                        return this.viewModel().expensiveNodes;
                    }
                    case "data-heavy": {
                        return this.viewModel().bigDataNodes;
                    }
                    case "warnings": {
                        return this.viewModel().warningsNodes;
                    }
                }
            }

            return [];
        });
    }
}


export class InfoBarSelectorItem extends SelectorItem {
    constructor(public id: string,
        public title: string,
        public template: string,
        public data: KnockoutComputed<AppNodeBase[]>
    ) {
        super(() => this.id);
    }
}

export class ViewModelSelectorItem extends SelectorItem {
    constructor(public title: string,
        public iconTemplate: string,
        public model: AppNodeViewModel
    ) {
        super(() => this.title);
    }
}

export declare type NodeViewMeta = {
    scrollTop: number | null;
    scrollLeft: number | null;
    scale: number | null;
    showInfo: boolean | null;

}


