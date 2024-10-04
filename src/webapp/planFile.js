"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const saxparser_1 = require("../sqlplan/saxparser");
const util_1 = require("../common/util");
const plan_1 = require("../app/plan");
class PlanFile {
    constructor() {
        this.properties = {
            id: (Math.random() * 16).toString(16).replace(/\./, "0").toLowerCase(),
            name: "",
            lastModified: new Date(),
            size: 0,
            nodeViewMetadata: {
                scrollLeft: 0,
                scrollTop: 0,
                scale: 1,
                showInfo: true
            }
        };
        this.updated = new ko.subscribable();
    }
    static deserialize(dataString) {
        const data = JSON.parse(dataString);
        const pf = new PlanFile();
        return pf.initialize(data.meta, data.content);
    }
    serialize() {
        const data = {
            meta: JSON.stringify(this.properties),
            content: this.content
        };
        return JSON.stringify(data);
    }
    get id() { return this.properties.id; }
    get name() { return this.properties.name; }
    set name(name) { this.properties.name = name; }
    get lastModified() { return this.properties.lastModified; }
    set lastModified(date) { this.properties.lastModified = date; }
    get size() { return this.properties.size; }
    set size(size) { this.properties.size = size; }
    get nodeViewMetadata() {
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
    get url() {
        return location.origin + location.pathname + "?plan.file.id=" + this.properties.id;
    }
    close() {
    }
    initialize(meta, content) {
        if (meta) {
            this.properties = JSON.parse(meta);
            this.properties.name = this.properties.name ? this.properties.name : ("pasted plan " + new Date().toDateString());
        }
        if (content) {
            this.content = content;
            this.properties.id = util_1.crc32(content).toString(36);
        }
        if (this.properties && this.properties.name && this.content) {
            this.data = saxparser_1.parse(this.properties.name, this.content);
            this.plan = new plan_1.AppPlan(this.data, this.nodeViewMetadata);
            this.plan.nodeViewMetadataUpdated.subscribe((newVal) => {
                this.properties.nodeViewMetadata = newVal;
                this.updated.notifySubscribers(newVal);
            });
        }
        return this;
    }
}
exports.PlanFile = PlanFile;
//# sourceMappingURL=planFile.js.map