"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const model_1 = require("./model");
const saxfactory_1 = require("./saxfactory");
function parse(name, planText) {
    const startTime = new Date();
    const context = new ParserContext(name);
    context.parse(planText);
    const endTime = new Date();
    console.info("plan processing: " + (((endTime.valueOf() - startTime.valueOf()) / 1000.0)));
    return context.plan;
}
exports.parse = parse;
class ParserContext {
    constructor(name) {
        this.name = name;
        this.planNodes = new core_1.Stack();
        this.items = new core_1.Stack();
        this.plan = new model_1.Plan(name);
        this.startElement({
            item: this.plan,
            childElements: {
                "ShowPlanXML": {
                    initializer: saxfactory_1.rootFactory,
                    setter: (value) => { }
                }
            }
        });
    }
    openTagHandler(tag) {
        //console.info(">" + tag.name);
        const current = this.items.current;
        if (current && current.childElements) {
            const handler = current.childElements[tag.name];
            if (!handler) {
                throw new Error("don't know how to process element");
            }
            handler.initializer(this, tag);
        }
    }
    closeTagHandler(tagName) {
        //console.info("<" + tagName);
        const current = this.items.current;
        if (current && current.finalize) {
            current.finalize(current, this);
        }
        this.endElement();
    }
    endHandler() {
        this.plan.postProcessing();
    }
    errorHandler(e) {
        console.error(e);
        throw e;
    }
    startElement(item) {
        if (item.isBatch) {
            this.currentBatch = new model_1.PlanBatch(this.plan);
            this.plan.batches.push(this.currentBatch);
        }
        if (item.isStatement && this.currentBatch) {
            const wssid = (item.element) ? item.element.attributes["WSSID"] : undefined;
            this.currentStatement = new model_1.PlanStatement(this.currentBatch, wssid);
            this.plan.statements.push(this.currentStatement);
            this.currentBatch.statements.push(this.currentStatement);
        }
        if (item.isNode && this.currentStatement) {
            if (!this.planNodes.isEmpty()) {
                let nd = new model_1.PlanNode(this.currentStatement);
                if (this.planNodes.current) {
                    this.planNodes.current.children.push(nd);
                }
                this.planNodes.push(nd);
            }
            else {
                let nd = new model_1.PlanNode(this.currentStatement);
                this.currentStatement.root = nd;
                this.planNodes.push(nd);
            }
        }
        item.planNode = this.planNodes.current;
        this.items.push(item);
    }
    endElement() {
        const item = this.items.pop();
        if (!item)
            throw new Error("unexpected endElement - items are empty");
        if (item.isNode) {
            this.planNodes.pop();
        }
        if (item.isStatement) {
            delete this.currentStatement;
        }
        if (item.isBatch) {
            delete this.currentBatch;
        }
        // apply value to the parent element
        if (this.items.current && item.element) {
            const current = this.items.current;
            if (current.childElements) {
                const el = item.element;
                const setter = current.childElements[el.name].setter;
                setter(item.item);
            }
        }
    }
    parse(input) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(input, "application/xml");
            if (doc && doc.documentElement) {
                const errors = doc.getElementsByTagName("parsererror");
                if (errors && errors.length > 0) {
                    const errorParts = [];
                    for (let index = 0; index < errors.length; index++) {
                        const error = errors[index];
                        if (error.textContent) {
                            errorParts.push(error.textContent);
                        }
                    }
                    throw new Error(errorParts.join("\n"));
                }
                this.walk(doc.documentElement);
            }
        }
        catch (err) {
            this.errorHandler(err);
        }
        this.endHandler();
    }
    walk(el) {
        if (el.localName) {
            const tag = {
                name: el.localName,
                attributes: {}
            };
            const attrs = el.attributes;
            for (let i = 0; i < attrs.length; i++) {
                const a = attrs[i];
                tag.attributes[a.name] = a.value;
            }
            this.openTagHandler(tag);
            let current = el.firstElementChild;
            while (current) {
                this.walk(current);
                current = current.nextElementSibling;
            }
            this.closeTagHandler(el.localName);
        }
    }
}
exports.ParserContext = ParserContext;
class SAXDOMParser {
    parse(input) {
    }
}
//plan processing: 0.103
//plan processing: 0.108
//plan processing: 0.102
//# sourceMappingURL=saxparser.js.map