import { RunTimeInformationType, RunTimeInformationTypeRunTimeCountersPerThread } from "./saxfactory";
import { getOrAdd } from "../common/util";
import { formatPercentage, formatByteSize } from "./formatter";
import { StringBuilder } from "../common/stringBuilder";

export declare type MetricsValue = string | boolean | number | (() => string);


function toNumber(val?: MetricsValue, defaultValue: number = 0.0): number {
    if (val === undefined) return defaultValue;
    if (typeof val === "function") {
        val = val();
        if (val === undefined) return defaultValue;
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

function toRoundedNumber(val?: MetricsValue, defaultValue: number = 0.0): number {
    return Math.round(toNumber(val, defaultValue));
}

export class MetricItem {
    group?: string | (() => string);
    estimated?: MetricsValue | MetricsValue[];
    actual?: MetricsValue | MetricsValue[];
    actuals: Array<MetricsValue | MetricsValue[]> = [];
    constructor(public id: string) {

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
            } else {
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
    getActualString(index: number) {
        return this.getString(this.actuals[index]);
    }

    private getString(value?: MetricsValue | MetricsValue[]) {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                const sb = new StringBuilder();
                for (const item of value) {
                    sb.append(((typeof item === "function") ? item() : item).toString());
                }
                return sb.format("<BR/>");

            } else {
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

const dataWriteOps: { [name: string]: boolean } = { "insert": true, "update": true, "merge": true, "delete": true };

export class Metrics {

    items: { [name: string]: MetricItem } = {};
    metricsSet?: string[][];
    absCost = 0.0;
    relSubtreeCost = 0.0;
    relCpuCost = 0.0;
    relIoCost = 0.0;
    relCost = 0.0;


    getActual(name: string, index: number = -1) {
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

    getEstimated(name: string) {
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
    get absCpuCost(): number {
        const item = this.items["CPU"];
        if (item != undefined) {
            return item.estimatedNumber;
        }
        return 0.0;
    }
    get absIoCost(): number {
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
    get isCostly(): boolean {
        return this.relativeCost > 0.01;
    }

    get rows(): number {
        const item = this.items["Rows"];
        if (item != undefined) {
            return item.estimatedNumber;
        }
        return 0.0;
    }

    get rowSize(): number {
        const item = this.items["Average Row Size"];
        if (item != undefined) {
            return item.actualNumber;
        }
        return 0.0;
    }

    get isBigData() {
        return this.actualRowCount > 10000 || this.actualDataSize > 1024 * 1024 * 10;
    }

    add(group: string | (() => string), id: string, value?: MetricsValue | MetricsValue[], thread?: number) {

        if (value === undefined || value === null) return;

        const mi = getOrAdd(this.items, id, (i) => new MetricItem(i));
        mi.group = group;

        if (typeof value !== "number") {
            if (thread === undefined) {
                mi.estimated = value;
            } else {
                mi.actuals[thread] = value;
                mi.actual = value;
            }
        } else {
            if (thread === undefined) {
                mi.estimated = value;
            } else {
                mi.actuals[thread] = value;
                if (mi.actual === undefined || typeof mi.actual !== "number") {
                    mi.actual = value;
                } else {
                    mi.actual += value;
                }
            }
        }


    }
    get metrics() {
        if (this.metricsSet === undefined) {

            //this.metricsSet = [];

            const mi = this.items;
            const metricsHeader: string[] = ["General", "Estimated", "Actual"];
            let metricsThreads: number = 0;

            const generalGroup: string[][] = [];

            //this.metricsSet.push(metricsHeader);

            const groups: { [name: string]: string[][] } = {};

            for (const mid in mi) {
                if (mi.hasOwnProperty(mid)) {
                    const item = mi[mid];
                    const row: string[] = [item.id, item.estimatedString, item.actualString];

                    if (item.actuals.length > 1) {
                        metricsThreads = Math.max(metricsThreads, item.actuals.length);

                        for (let index = 0; index < item.actuals.length; index++) {
                            row[index + 3] = item.getActualString(index);
                        }
                    }

                    const category = item.category;
                    if (category === "General") {
                        generalGroup.push(row);
                    } else {
                        getOrAdd(groups, category, (k) => []).push(row);
                    }
                }
            }

            const maxColumns = metricsThreads + 3;
            for (let index = 3, tr = 0; index < maxColumns; index++ , tr++) {
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
    sortCategory(category: string[][], maxColumns: number, target: string[][]) {
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
        statistics.push(
            { name: "IO:", value: formatPercentage(this.relIoCost), warning: false },
            { name: "CPU:", value: formatPercentage(this.relCpuCost), warning: false }
        );
        const dataSize = this.actualDataSize;
        if (dataSize > 0) {
            statistics.push(
                { name: "SIZE:", value: formatByteSize(dataSize), warning: this.isBigData }
            );
        }

        const rowsItem = this.items["Rows"];
        if (rowsItem != undefined) {
            const records = Math.round(rowsItem.actualNumber);

            statistics.push(
                { name: "ROWS:", value: records.toString(), warning: this.isBigData }
            );

            if (rowsItem.warning) {
                statistics.push(
                    { name: "ESTIMATED:", value: Math.round(rowsItem.estimatedNumber).toString(), warning: true }
                );
            }
        }
        return statistics;
    }

    calculateRelativeCost(cpuCost: number, ioCost: number, cost: number, subtreeCost: number) {
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