"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selector_1 = require("../common/selector");
const nodeViewModel_1 = require("./nodeViewModel");
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
class NodeView {
    constructor(plan, nodeViewMeta, defaultViewModel = nodeViewModel_1.AppNodeViewModel.default, compactViewModel = nodeViewModel_1.AppNodeViewModel.default, joinViewModel = nodeViewModel_1.AppNodeViewModel.default) {
        this.plan = plan;
        this.defaultViewModel = defaultViewModel;
        this.compactViewModel = compactViewModel;
        this.joinViewModel = joinViewModel;
        this.emptyViewModel = new nodeViewModel_1.AppNodeViewModel();
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
        this.viewModelSelector = new selector_1.Selector("viewModel", [
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
        this.infoBarSelector = new selector_1.Selector("infobar", [
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
exports.NodeView = NodeView;
class InfoBarSelectorItem extends selector_1.SelectorItem {
    constructor(id, title, template, data) {
        super(() => this.id);
        this.id = id;
        this.title = title;
        this.template = template;
        this.data = data;
    }
}
exports.InfoBarSelectorItem = InfoBarSelectorItem;
class ViewModelSelectorItem extends selector_1.SelectorItem {
    constructor(title, iconTemplate, model) {
        super(() => this.title);
        this.title = title;
        this.iconTemplate = iconTemplate;
        this.model = model;
    }
}
exports.ViewModelSelectorItem = ViewModelSelectorItem;
//# sourceMappingURL=view.js.map