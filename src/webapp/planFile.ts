import { Plan } from "../sqlplan/model";
import { parse } from "../sqlplan/saxparser";
import { crc32 } from "../common/util";
import { AppPlan } from "../app/plan";
import { NodeViewMeta } from "../app/view";

export class PlanFile {

    static deserialize(dataString: string): PlanFile {
        const data = JSON.parse(dataString);

        const pf = new PlanFile();
        return pf.initialize(data.meta, data.content);
    }

    serialize(): string {

        const data = {
            meta: JSON.stringify(this.properties),
            content: this.content
        };

        return JSON.stringify(data);
    }

    properties = {
        id: (Math.random() * 16).toString(16).replace(/\./, "0").toLowerCase(),
        name: "",
        lastModified: new Date(),
        size: 0,
        nodeViewMetadata: {
            scrollLeft: 0,
            scrollTop: 0,
            scale: 1,
            showInfo: true
        } as NodeViewMeta
    };

    data?: Plan;
    plan?: AppPlan;
    content?: string;

    get id(): string { return this.properties.id; }
    get name(): string { return this.properties.name; }
    set name(name: string) { this.properties.name = name; }
    get lastModified(): Date { return this.properties.lastModified; }
    set lastModified(date: Date) { this.properties.lastModified = date; }
    get size(): number { return this.properties.size; }
    set size(size: number) { this.properties.size = size; }
    get nodeViewMetadata(): NodeViewMeta {
        if (!this.properties.nodeViewMetadata) {
            this.properties.nodeViewMetadata = {
                scrollLeft: 0,
                scrollTop: 0,
                showInfo: true,
                scale: 1
            };
        }
        return this.properties.nodeViewMetadata;
    }

    get url(): string {
        return location.origin + location.pathname + "?plan.file.id=" + this.properties.id;
    }


    updated: KnockoutSubscribable<NodeViewMeta>;

    constructor() {
        this.updated = new ko.subscribable();
    }

    close() {
    }

    initialize(meta?: string, content?: string) {

        if (meta) {
            this.properties = JSON.parse(meta);
            this.properties.name = this.properties.name ? this.properties.name : ("pasted plan " + new Date().toDateString());
        }

        if (content) {
            this.content = content;
            this.properties.id = crc32(content).toString(36);
        }


        if (this.properties && this.properties.name && this.content) {
            this.data = parse(this.properties.name, this.content);

            this.plan = new AppPlan(this.data, this.nodeViewMetadata);
            this.plan.nodeViewMetadataUpdated.subscribe((newVal) => {
                this.properties.nodeViewMetadata = newVal;
                this.updated.notifySubscribers(newVal);
            });
        }
        return this;
    }
}