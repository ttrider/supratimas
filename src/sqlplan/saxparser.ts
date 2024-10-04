import { Stack } from "./core";
import { Plan, PlanStatement, PlanBatch, PlanNode } from "./model";
import { ItemContext, rootFactory, InputElement } from "./saxfactory";

export function parse(name: string, planText: string): Plan {

    const startTime = new Date();

    const context = new ParserContext(name);

    context.parse(planText);

    const endTime = new Date();
    console.info("plan processing: " + (((endTime.valueOf() - startTime.valueOf()) / 1000.0)));

    return context.plan;
}


export class ParserContext {

    openTagHandler(tag: InputElement) {
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

    closeTagHandler(tagName: string) {
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
    errorHandler(e: Error) {
        console.error(e);
        throw e;
    }

    startElement(item: ItemContext): any {

        if (item.isBatch) {
            this.currentBatch = new PlanBatch(this.plan);
            this.plan.batches.push(this.currentBatch);
        }

        if (item.isStatement && this.currentBatch) {
            const wssid = (item.element) ? item.element.attributes["WSSID"] : undefined;
            this.currentStatement = new PlanStatement(this.currentBatch, wssid);
            this.plan.statements.push(this.currentStatement);
            this.currentBatch.statements.push(this.currentStatement);
        }

        if (item.isNode && this.currentStatement) {
            if (!this.planNodes.isEmpty()) {
                let nd = new PlanNode(this.currentStatement);
                if (this.planNodes.current) {
                    this.planNodes.current.children.push(nd);
                }
                this.planNodes.push(nd);
            }
            else {
                let nd = new PlanNode(this.currentStatement);
                this.currentStatement.root = nd;
                this.planNodes.push(nd);
            }
        }

        item.planNode = this.planNodes.current;
        this.items.push(item);
    }
    endElement() {

        const item = this.items.pop();
        if (!item) throw new Error("unexpected endElement - items are empty");

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
    currentStatement?: PlanStatement;
    currentBatch?: PlanBatch;
    plan: Plan;
    planNodes: Stack<PlanNode> = new Stack<PlanNode>();
    items: Stack<ItemContext> = new Stack<ItemContext>();

    constructor(public name: string) {
        this.plan = new Plan(name);

        this.startElement({
            item: this.plan,
            childElements: {
                "ShowPlanXML": {
                    initializer: rootFactory,
                    setter: (value) => { }
                }
            }
        });
    }

    parse(input: string) {
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(input, "application/xml") as XMLDocument;
            if (doc && doc.documentElement) {

                const errors = doc.getElementsByTagName("parsererror");
                if (errors && errors.length > 0) {
                    const errorParts: string[] = [];
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

    walk(el: Element) {
        if (el.localName) {
            const tag: InputElement = {
                name: el.localName,
                attributes: {} as { [key: string]: string }
            }

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



class SAXDOMParser {

    onopentag?: (tag: InputElement) => void;
    onclosetag?: (tagName: string) => void;
    onend?: () => void;
    onerror?: (e: Error) => void;

    parse(input: string) {

    }


}


//plan processing: 0.103
//plan processing: 0.108
//plan processing: 0.102