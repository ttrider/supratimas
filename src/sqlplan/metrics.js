"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../common/util");
const formatter_1 = require("./formatter");
const stringBuilder_1 = require("../common/stringBuilder");
function toNumber(val, defaultValue = 0.0) {
    if (val === undefined)
        return defaultValue;
    if (typeof val === "function") {
        val = val();
        if (val === undefined)
            return defaultValue;
    }
    if (typeof val === "number") {
        return val;
    }
    if (typeof val === "boolean") {
        return val ? 1 : 0;
    }
    val = val.toString();
    val = parseInt(val);
    if (isNaN(val)) {
        return defaultValue;
    }
    return val;
}
function toRoundedNumber(val, defaultValue = 0.0) {
    return Math.round(toNumber(val, defaultValue));
}
class MetricItem {
    constructor(id) {
        this.id = id;
        this.actuals = [];
    }
    get warning() {
        if (this.estimated !== undefined && this.actual != undefined) {
            const eVal = this.estimatedNumber;
            const aVal = this.actualNumber;
            if (eVal === 0.0) {
                if (aVal === 0.0) {
                    return false;
                }
                return true;
            }
            else {
                if (aVal === 0.0) {
                    return true;
                }
                const p = eVal > aVal ? aVal / eVal : eVal / aVal;
                return (p < 0.9);
            }
        }
    }
    get category() {
        if (this.group === undefined) {
            return "General";
        }
        if (typeof this.group === "function") {
            return this.group();
        }
        if (!this.group) {
            return "General";
        }
        return this.group;
    }
    get estimatedString() {
        return this.getString(this.estimated);
    }
    get actualString() {
        return this.getString(this.actual);
    }
    getActualString(index) {
        return this.getString(this.actuals[index]);
    }
    getString(value) {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                const sb = new stringBuilder_1.StringBuilder();
                for (const item of value) {
                    sb.append(((typeof item === "function") ? item() : item).toString());
                }
                return sb.format("<BR/>");
            }
            else {
                return ((typeof value === "function") ? value() : value).toString();
            }
        }
        return "";
    }
    get estimatedNumber() {
        if (this.estimated != undefined) {
            if (typeof this.estimated === "number") {
                return this.estimated;
            }
            return parseInt(this.estimated.toString());
        }
        return 0.0;
    }
    get actualNumber() {
        if (this.actual != undefined) {
            if (typeof this.actual === "number") {
                return this.actual;
            }
            return parseInt(this.actual.toString());
        }
        return 0.0;
    }
}
exports.MetricItem = MetricItem;
const dataWriteOps = { "insert": true, "update": true, "merge": true, "delete": true };
class Metrics {
    constructor() {
        this.items = {};
        this.absCost = 0.0;
        this.relSubtreeCost = 0.0;
        this.relCpuCost = 0.0;
        this.relIoCost = 0.0;
        this.relCost = 0.0;
    }
    getActual(name, index = -1) {
        const item = this.items[name];
        if (item != undefined) {
            if (index === -1) {
                return item.actual;
            }
            if (index < item.actuals.length) {
                return item.actuals[index];
            }
        }
    }
    getEstimated(name) {
        const item = this.items[name];
        if (item != undefined) {
            return item.estimated;
        }
    }
    get isDataWrite() {
        const item = this.items["Logical Operation"];
        if (item != undefined && item.actual !== undefined) {
            if (dataWriteOps[item.actual.toString().toLowerCase()]) {
                return true;
            }
        }
        return false;
    }
    get actualDataSize() {
        return this.rowSize * this.actualRowCount;
    }
    get actualRowCount() {
        const item = this.items["Rows"];
        if (item != undefined) {
            return Math.round(item.actualNumber);
        }
        return 0.0;
    }
    get estimatedRowCount() {
        const item = this.items["Rows"];
        if (item != undefined) {
            return Math.round(item.estimatedNumber);
        }
        return 0.0;
    }
    get absSubtreeCost() {
        const item = this.items["Total Subtree Cost"];
        if (item != undefined) {
            return item.estimatedNumber;
        }
        return 0.0;
    }
    get absCpuCost() {
        const item = this.items["CPU"];
        if (item != undefined) {
            return item.estimatedNumber;
        }
        return 0.0;
    }
    get absIoCost() {
        const item = this.items["IO"];
        if (item != undefined) {
            return item.estimatedNumber;
        }
        return 0.0;
    }
    get relativeCost() {
        return this.relCost;
    }
    get relativeSubtreeCost() {
        return this.relSubtreeCost;
    }
    get isCostly() {
        return this.relativeCost > 0.01;
    }
    get rows() {
        const item = this.items["Rows"];
        if (item != undefined) {
            return item.estimatedNumber;
        }
        return 0.0;
    }
    get rowSize() {
        const item = this.items["Average Row Size"];
        if (item != undefined) {
            return item.actualNumber;
        }
        return 0.0;
    }
    get isBigData() {
        return this.actualRowCount > 10000 || this.actualDataSize > 1024 * 1024 * 10;
    }
    add(group, id, value, thread) {
        if (value === undefined || value === null)
            return;
        const mi = util_1.getOrAdd(this.items, id, (i) => new MetricItem(i));
        mi.group = group;
        if (typeof value !== "number") {
            if (thread === undefined) {
                mi.estimated = value;
            }
            else {
                mi.actuals[thread] = value;
                mi.actual = value;
            }
        }
        else {
            if (thread === undefined) {
                mi.estimated = value;
            }
            else {
                mi.actuals[thread] = value;
                if (mi.actual === undefined || typeof mi.actual !== "number") {
                    mi.actual = value;
                }
                else {
                    mi.actual += value;
                }
            }
        }
    }
    get metrics() {
        if (this.metricsSet === undefined) {
            //this.metricsSet = [];
            const mi = this.items;
            const metricsHeader = ["General", "Estimated", "Actual"];
            let metricsThreads = 0;
            const generalGroup = [];
            //this.metricsSet.push(metricsHeader);
            const groups = {};
            for (const mid in mi) {
                if (mi.hasOwnProperty(mid)) {
                    const item = mi[mid];
                    const row = [item.id, item.estimatedString, item.actualString];
                    if (item.actuals.length > 1) {
                        metricsThreads = Math.max(metricsThreads, item.actuals.length);
                        for (let index = 0; index < item.actuals.length; index++) {
                            row[index + 3] = item.getActualString(index);
                        }
                    }
                    const category = item.category;
                    if (category === "General") {
                        generalGroup.push(row);
                    }
                    else {
                        util_1.getOrAdd(groups, category, (k) => []).push(row);
                    }
                }
            }
            const maxColumns = metricsThreads + 3;
            for (let index = 3, tr = 0; index < maxColumns; index++, tr++) {
                metricsHeader[index] = tr.toString();
            }
            this.metricsSet = [metricsHeader];
            this.sortCategory(generalGroup, maxColumns, this.metricsSet);
            for (const catName in groups) {
                if (groups.hasOwnProperty(catName)) {
                    this.metricsSet.push([catName]);
                    this.sortCategory(groups[catName], maxColumns, this.metricsSet);
                }
            }
        }
        return this.metricsSet;
    }
    sortCategory(category, maxColumns, target) {
        const ret = category.sort((a, b) => {
            const aval = a[0];
            const bval = b[0];
            return aval === bval ? 0 : (aval < bval ? -1 : 1);
        });
        for (const row of ret) {
            for (let index = row.length; index < maxColumns; index++) {
                row[index] = "";
            }
            target.push(row);
        }
    }
    get statistics() {
        const statistics = [];
        statistics.push({ name: "IO:", value: formatter_1.formatPercentage(this.relIoCost), warning: false }, { name: "CPU:", value: formatter_1.formatPercentage(this.relCpuCost), warning: false });
        const dataSize = this.actualDataSize;
        if (dataSize > 0) {
            statistics.push({ name: "SIZE:", value: formatter_1.formatByteSize(dataSize), warning: this.isBigData });
        }
        const rowsItem = this.items["Rows"];
        if (rowsItem != undefined) {
            const records = Math.round(rowsItem.actualNumber);
            statistics.push({ name: "ROWS:", value: records.toString(), warning: this.isBigData });
            if (rowsItem.warning) {
                statistics.push({ name: "ESTIMATED:", value: Math.round(rowsItem.estimatedNumber).toString(), warning: true });
            }
        }
        return statistics;
    }
    calculateRelativeCost(cpuCost, ioCost, cost, subtreeCost) {
        if (cpuCost) {
            this.relCpuCost = this.absCpuCost / cpuCost;
        }
        if (ioCost) {
            this.relIoCost = this.absIoCost / ioCost;
        }
        if (cost) {
            this.relCost = this.absCost / cost;
        }
        if (subtreeCost) {
            this.relSubtreeCost = this.absSubtreeCost / subtreeCost;
        }
    }
}
exports.Metrics = Metrics;
//# sourceMappingURL=metrics.js.map