"use strict";
// import { Plan, PlanBatch, PlanStatement, PlanNode } from "./model";
// import { Warning } from "./Warning";
// import { DataInfo } from "./dataInfo";
// import { Metrics, MetricItem, MetricsValue } from "./metrics";
// export function serializePlan(plan?: Plan) {
//     if (!plan) return;
//     return {
//         name: plan.name,
//         batches: plan.batches.map(item => serializeBatch(item))
//     }
// }
// export function serializeBatch(planBatch?: PlanBatch) {
//     if (!planBatch) { return; }
//     return {
//         statements: planBatch.statements.map(item => serializeStatement(item))
//     }
// }
// export function serializeStatement(planStatement?: PlanStatement) {
//     if (!planStatement) { return; }
//     return {
//         id: planStatement.id,
//         statementText: planStatement.statementText,
//         missingIndexText: planStatement.missingIndexText,
//         relativeStatementCost: planStatement.relativeStatementCost,
//         subtreeCost: planStatement.subtreeCost,
//         absIoCost: planStatement.absIoCost,
//         absCpuCost: planStatement.absCpuCost,
//         ansi: planStatement.ansi,
//         warnings: planStatement.warnings.map(item => serializeWarning(item)),
//         root: serializeNode(planStatement.root),
//     };
// }
// export interface serializedWarning {
//     title: string,
//     properties: {
//         name?: string | undefined;
//         value: string | (() => string) | null;
//     }[];
// }
// export function serializeWarning(warning?: Warning): serializedWarning | undefined {
//     if (!warning) return;
//     return {
//         title: warning.title,
//         properties: warning.properties
//     }
// }
// export interface serializedNode {
//     iconTemplate?: string;
//     nameSet: string[];
//     flags: string[];
//     children: (serializedNode | undefined)[];
//     dataInfo?: serializedDataInfo;
//     metrics?: serializedMetrics;
//     warnings: (serializedWarning | undefined)[];
// }
// export function serializeNode(planNode?: PlanNode): serializedNode | undefined {
//     if (!planNode) return;
//     return {
//         iconTemplate: planNode.iconTemplate,
//         nameSet: planNode.nameSet.map(item => typeof item === "function" ? item() : item),
//         flags: planNode.flags,
//         children: planNode.children.map(item => serializeNode(item)),
//         dataInfo: serializeDataInfo(planNode.dataInfo),
//         metrics: serializeMetrics(planNode.metrics),
//         warnings: planNode.warnings.map(item => serializeWarning(item))
//     };
// }
// // DataInfo
// export interface serializedDataInfo {
// }
// export function serializeDataInfo(dataInfo?: DataInfo): serializedDataInfo | undefined {
//     if (dataInfo === undefined || dataInfo === null) return;
//     objects: ObjectType[] = [];
//     defaultServer: Server = new Server();
//     servers: { [name: string]: Server } = {};
//     private allTables: Table[] = [];
//     private columnSets: { [name: string]: IColumn[] } = {};
//     dataInfo.
// }
// export function deserializeDataInfo(value?: serializedDataInfo): DataInfo | undefined {
// }
// //#region Metrics
// export interface serializedMetrics {
//     items: {
//         [name: string]: serializedMetricItem;
//     };
//     metricsSet: string[][] | undefined;
//     absCost: number;
//     relSubtreeCost: number;
//     relCpuCost: number;
//     relIoCost: number;
//     relCost: number;
// }
// export function serializeMetrics(metrics?: Metrics): serializedMetrics | undefined {
//     if (!metrics) return;
//     const items: { [name: string]: serializedMetricItem } = {}
//     for (const key in metrics.items) {
//         if (metrics.items.hasOwnProperty(key)) {
//             const val = serializeMetricItem(metrics.items[key]);
//             if (val !== undefined) { items[key] = val; }
//         }
//     }
//     const ret =
//     {
//         items: items,
//         metricsSet: metrics.metricsSet,
//         absCost: metrics.absCost,
//         relSubtreeCost: metrics.relSubtreeCost,
//         relCpuCost: metrics.relCpuCost,
//         relIoCost: metrics.relIoCost,
//         relCost: metrics.relCost
//     };
//     return ret;
// }
// export function deserializeMetrics(value?: serializedMetrics): Metrics | undefined {
//     if (value === undefined || value === null) return;
//     const ret = new Metrics();
//     ret.metricsSet = value.metricsSet;
//     ret.absCost = value.absCost;
//     ret.relSubtreeCost = value.relSubtreeCost;
//     ret.relCpuCost = value.relCpuCost;
//     ret.relIoCost = value.relIoCost;
//     ret.relCost = value.relCost;
//     for (const key in value.items) {
//         if (value.items.hasOwnProperty(key)) {
//             const val = deserializeMetricItem(value.items[key]);
//             if (val !== undefined) {
//                 ret.items[key] = val;
//             }
//         }
//     }
//     return ret;
// }
// //#endregion Metrics
// //#region MetricItem
// export interface serializedMetricItem {
//     id: string;
//     group?: string;
//     estimated?: serializedMetricValue | serializedMetricValue[];
//     actual?: serializedMetricValue | serializedMetricValue[];
//     actuals: (serializedMetricValue | serializedMetricValue[] | undefined)[];
// }
// export function serializeMetricItem(metricItem?: MetricItem): serializedMetricItem | undefined {
//     if (!metricItem) return;
//     return {
//         id: metricItem.id,
//         group: metricItem.group === undefined ? undefined : (typeof metricItem.group === "function" ? metricItem.group() : metricItem.group),
//         estimated: serializeMetricValue(metricItem.estimated),
//         actual: serializeMetricValue(metricItem.actual),
//         actuals: metricItem.actuals.map(item => serializeMetricValue(item))
//     };
// }
// export function deserializeMetricItem(value: serializedMetricItem): MetricItem | undefined {
//     if (value === undefined || value === null) return;
//     const ret = new MetricItem(value.id);
//     ret.group = value.group;
//     ret.estimated = deserializeMetricValue(value.estimated);
//     ret.actual = deserializeMetricValue(value.actual);
//     if (value.actuals) {
//         for (const item of value.actuals) {
//             const val = deserializeMetricValue(item);
//             if (val !== undefined) {
//                 ret.actuals.push(val);
//             }
//         }
//     }
//     return ret;
// }
// //#endregion MetricItem
// //#region MetricValue
// export declare type serializedMetricValue = string | number | boolean;
// export function serializeMetricValue(metricValue?: MetricsValue | MetricsValue[]): undefined | serializedMetricValue | serializedMetricValue[] {
//     if (metricValue == undefined || metricValue === null) return;
//     if (Array.isArray(metricValue)) {
//         return metricValue.map(item => (typeof item === "function" ? item() : item)) as serializedMetricValue[];
//     }
//     return (typeof metricValue === "function" ? metricValue() : metricValue) as serializedMetricValue;
// }
// export function deserializeMetricValue(value?: serializedMetricValue | serializedMetricValue[]): MetricsValue | MetricsValue[] | undefined {
//     if (value === undefined || value === null) return;
//     return value;
// }
// //#endregion
//# sourceMappingURL=serializer.js.map