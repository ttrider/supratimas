"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const saxformat_1 = require("./saxformat");
const stringBuilder_1 = require("../common/stringBuilder");
function SingleColumnReferenceTypeBinder(node, bindAs, item) {
    if (item && item.ColumnReference) {
        node.dataInfo.addColumns(bindAs, [item.ColumnReference]);
    }
}
exports.SingleColumnReferenceTypeBinder = SingleColumnReferenceTypeBinder;
function ColumnReferenceListTypeBinder(node, bindAs, item) {
    if (item) {
        node.dataInfo.addColumns(bindAs, item);
        if (bindAs === "groupby") {
            if (item.length > 0) {
                node.nameSet.push("by");
                for (const c of item) {
                    const column = node.dataInfo.getColumn(c);
                    node.nameSet.push(() => column.displayName);
                }
            }
        }
        else if (bindAs === "warning_no_statistics") {
            if (item.length > 0) {
                const w = node.addNodeWarning("Columns Without Statisctics");
                for (const c of item) {
                    const column = node.dataInfo.getColumn(c);
                    w.addListItem(() => column.displayName);
                }
            }
        }
        else if (bindAs === "parameter") {
            for (const p of item) {
                const column = node.dataInfo.getColumn(p);
                const val = [];
                if (p.ParameterDataType) {
                    val.push(p.ParameterDataType);
                }
                if (p.ScalarOperator) {
                    val.push(saxformat_1.formatScalar(node, p.ScalarOperator, (v) => " = " + v));
                }
                if (p.ParameterRuntimeValue !== undefined) {
                    val.push(p.ParameterRuntimeValue);
                    if (p.ParameterCompiledValue != undefined && p.ParameterRuntimeValue !== p.ParameterCompiledValue) {
                        val.push("compiled: " + p.ParameterCompiledValue);
                    }
                }
                else if (p.ParameterCompiledValue !== undefined) {
                    val.push(p.ParameterCompiledValue);
                }
                node.metrics.add("Parameters", column.displayName, val, 0);
            }
        }
    }
}
exports.ColumnReferenceListTypeBinder = ColumnReferenceListTypeBinder;
function OrderByTypeBinder(node, bindAs, item) {
    if (item) {
        const columns = node.dataInfo.addOrderByColumns(item);
        for (const column of columns) {
            node.nameSet.push(() => { return column.displayName + " " + column.ascending; });
        }
    }
}
exports.OrderByTypeBinder = OrderByTypeBinder;
function ObjectTypeBinder(node, bindAs, item) {
    if (item) {
        const items = Array.isArray(item) ? item : [item];
        node.dataInfo.addObjects(bindAs, items);
        if (bindAs === "indexed_view") {
            for (const ivn of items) {
                const iv = node.dataInfo.getTable(ivn);
                if (iv) {
                    node.metrics.add("General", "Indexed View", () => iv.displayName, 0);
                }
            }
        }
    }
}
exports.ObjectTypeBinder = ObjectTypeBinder;
function RunTimeInformationTypeBinder(node, bindAs, items) {
    if (!items)
        return;
    for (const item of items) {
        node.metrics.add("General", "Brick Id", item.BrickId, item.Thread);
        node.metrics.add("General", "Rebinds", item.ActualRebinds, item.Thread);
        node.metrics.add("General", "Rewinds", item.ActualRewinds, item.Thread);
        node.metrics.add("Reads", "Rows", item.ActualRows, item.Thread);
        node.metrics.add("Reads", "Rows Read", item.ActualRowsRead, item.Thread);
        node.metrics.add("General", "Batches", item.Batches, item.Thread);
        node.metrics.add("General", "End Of Scans", item.ActualEndOfScans, item.Thread);
        node.metrics.add("General", "Executions", item.ActualExecutions, item.Thread);
        node.metrics.add("General", "Execution Mode", item.ActualExecutionMode, item.Thread);
        node.metrics.add("General", "Task Addr", item.TaskAddr, item.Thread);
        node.metrics.add("General", "Scheduler Id", item.SchedulerId, item.Thread);
        node.metrics.add("Timings", "First Active Time", item.FirstActiveTime, item.Thread);
        node.metrics.add("Timings", "Last Active Time", item.LastActiveTime, item.Thread);
        node.metrics.add("Timings", "Open Time", item.OpenTime, item.Thread);
        node.metrics.add("Timings", "First Row Time", item.FirstRowTime, item.Thread);
        node.metrics.add("Timings", "Last Row Time", item.LastRowTime, item.Thread);
        node.metrics.add("Timings", "Close Time", item.CloseTime, item.Thread);
        node.metrics.add("Timings", "Elapsed ms", item.ActualElapsedms, item.Thread);
        node.metrics.add("General", "CPU", item.ActualCPUms, item.Thread);
        node.metrics.add("General", "Scans", item.ActualScans, item.Thread);
        node.metrics.add("Reads", "Logical Reads", item.ActualLogicalReads, item.Thread);
        node.metrics.add("Reads", "Physical Reads", item.ActualPhysicalReads, item.Thread);
        node.metrics.add("Reads", "Read Aheads", item.ActualReadAheads, item.Thread);
        node.metrics.add("Reads", "Lob Logical Reads", item.ActualLobLogicalReads, item.Thread);
        node.metrics.add("Reads", "Lob Physical Reads", item.ActualLobPhysicalReads, item.Thread);
        node.metrics.add("Reads", "Lob Read Aheads", item.ActualLobReadAheads, item.Thread);
        node.metrics.add("Reads", "Segment Reads", item.SegmentReads, item.Thread);
        node.metrics.add("Reads", "Segment Skips", item.SegmentSkips, item.Thread);
        node.metrics.add("Reads", "Locally Aggregated Rows", item.ActualLocallyAggregatedRows, item.Thread);
        node.metrics.add("Memory", "Input Memory Grant", item.InputMemoryGrant, item.Thread);
        node.metrics.add("Memory", "Output Memory Grant", item.OutputMemoryGrant, item.Thread);
        node.metrics.add("Memory", "Used Memory Grant", item.UsedMemoryGrant, item.Thread);
        node.metrics.add("General", "Is Interleaved Executed", item.IsInterleavedExecuted, item.Thread);
        node.metrics.add("General", "Join Type", item.ActualJoinType, item.Thread);
    }
}
exports.RunTimeInformationTypeBinder = RunTimeInformationTypeBinder;
function DefinedValuesListTypeBinder(node, bindAs, items) {
    if (!items)
        return;
    for (const item of items) {
        if (item.ValueVector) {
            const functionArguments = extractIntrinsicArguments(item.ScalarOperator);
            if (functionArguments && item.ValueVector.length === functionArguments.arguments.length) {
                for (let index = 0; index < item.ValueVector.length; index++) {
                    const column = item.ValueVector[index];
                    const value = functionArguments.arguments[index];
                    node.dataInfo.addDefinedColumn(column, value, functionArguments.functionName);
                }
            }
        }
        if (item.ScalarOperator && item.ColumnReference.length === 1) {
            node.dataInfo.addDefinedColumn(item.ColumnReference[0], item.ScalarOperator);
        }
    }
    function extractIntrinsicArguments(stype) {
        if (stype) {
            if (stype.Intrinsic) {
                if (stype.Intrinsic.ScalarOperator && stype.Intrinsic.FunctionName) {
                    return {
                        functionName: stype.Intrinsic.FunctionName,
                        arguments: stype.Intrinsic.ScalarOperator
                    };
                }
            }
        }
    }
}
exports.DefinedValuesListTypeBinder = DefinedValuesListTypeBinder;
function ScalarExpressionTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.ScalarOperator) {
        node.dataInfo.addScalarExpression(bindAs, item.ScalarOperator);
    }
}
exports.ScalarExpressionTypeBinder = ScalarExpressionTypeBinder;
function SeekPredicateTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    node.dataInfo.addSeekPredicate(bindAs, item);
}
exports.SeekPredicateTypeBinder = SeekPredicateTypeBinder;
function SeekPredicateNewTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    for (const spn of item) {
        SeekPredicateTypeBinder(node, bindAs, spn);
    }
}
exports.SeekPredicateNewTypeBinder = SeekPredicateNewTypeBinder;
function SeekPredicatesTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.SeekPredicate) {
        for (const sp of item.SeekPredicate) {
            node.dataInfo.addSeekPredicate(bindAs, sp);
        }
    }
    if (item.SeekPredicateNew) {
        for (const spn of item.SeekPredicateNew) {
            for (const sp of spn) {
                node.dataInfo.addSeekPredicate(bindAs, sp);
            }
        }
    }
    if (item.SeekPredicatePart) {
        for (let index = 0; index < item.SeekPredicatePart.length; index++) {
            const sppi = item.SeekPredicatePart[index];
            for (const spn of sppi) {
                for (const sp of spn) {
                    node.dataInfo.addSeekPredicate(bindAs, sp, index);
                }
            }
        }
    }
}
exports.SeekPredicatesTypeBinder = SeekPredicatesTypeBinder;
function SetPredicateElementTypeBinder(node, bindAs, items) {
    if (!items)
        return;
    for (const item of items) {
        if (item.ScalarOperator) {
            node.dataInfo.addScalarExpression(bindAs, item.ScalarOperator);
        }
    }
}
exports.SetPredicateElementTypeBinder = SetPredicateElementTypeBinder;
function StarJoinInfoTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    const sb = new stringBuilder_1.StringBuilder("STAR JOIN");
    if (item.Root) {
        sb.append("(root)");
    }
    if (item.OperationType) {
        sb.append(item.OperationType);
    }
    node.nameSet.push(sb.format(" "));
}
exports.StarJoinInfoTypeBinder = StarJoinInfoTypeBinder;
function WarningsTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.NoJoinPredicate) {
        node.addNodeWarning("No Join Predicate");
    }
    if (item.SpatialGuess) {
        node.addNodeWarning("Spatial Guess");
    }
    if (item.UnmatchedIndexes) {
        node.addNodeWarning("Unmatched Indexes");
    }
    if (item.FullUpdateForOnlineIndexBuild) {
        node.addNodeWarning("Full Update For Online Index Build");
    }
}
exports.WarningsTypeBinder = WarningsTypeBinder;
function SpillToTempDbTypeBinder(node, bindAs, items) {
    if (!items || items.length === 0)
        return;
    for (const item of items) {
        if (item) {
            node.addNodeWarning("Spill To TempDB")
                .addProperty("Spill Level", item.SpillLevel)
                .addProperty("Thread Count", item.SpilledThreadCount);
        }
    }
}
exports.SpillToTempDbTypeBinder = SpillToTempDbTypeBinder;
function WaitWarningTypeBinder(node, bindAs, items) {
    if (!items || items.length === 0)
        return;
    for (const item of items) {
        if (item) {
            node.addNodeWarning("Wait")
                .addProperty("Wait Type", item.WaitType)
                .addProperty("Wait Time", item.WaitTime);
        }
    }
}
exports.WaitWarningTypeBinder = WaitWarningTypeBinder;
function AffectingConvertWarningTypeBinder(node, bindAs, items) {
    if (!items || items.length === 0)
        return;
    for (const item of items) {
        if (item) {
            node.addNodeWarning("Affecting Convert")
                .addProperty("Issue", item.ConvertIssue)
                .addProperty("Expression", item.Expression);
        }
    }
}
exports.AffectingConvertWarningTypeBinder = AffectingConvertWarningTypeBinder;
function SortSpillDetailsTypeBinder(node, bindAs, items) {
    if (!items || items.length === 0)
        return;
    for (const item of items) {
        if (item) {
            node.addNodeWarning("Sort Spill Details")
                .addProperty("Granted Memory (KB)", item.GrantedMemoryKb)
                .addProperty("Used Memory (KB)", item.UsedMemoryKb)
                .addProperty("Reads from TempDB", item.ReadsFromTempDb)
                .addProperty("Writes to TempDB", item.WritesToTempDb);
        }
    }
}
exports.SortSpillDetailsTypeBinder = SortSpillDetailsTypeBinder;
function HashSpillDetailsTypeBinder(node, bindAs, items) {
    if (!items || items.length === 0)
        return;
    for (const item of items) {
        if (item) {
            node.addNodeWarning("Sort Spill Details")
                .addProperty("Granted Memory (KB)", item.GrantedMemoryKb)
                .addProperty("Used Memory (KB)", item.UsedMemoryKb)
                .addProperty("Reads from TempDB", item.ReadsFromTempDb)
                .addProperty("Writes to TempDB", item.WritesToTempDb);
        }
    }
}
exports.HashSpillDetailsTypeBinder = HashSpillDetailsTypeBinder;
function MemoryGrantWarningInfoBinder(node, bindAs, item) {
    if (!item)
        return;
    node.addNodeWarning((item.GrantWarningKind ? "Memory: " + item.GrantWarningKind : "Memory"))
        .addProperty("Requested Memory", item.RequestedMemory)
        .addProperty("Granted Memory", item.GrantedMemory)
        .addProperty("Max Used Memory", item.MaxUsedMemory);
}
exports.MemoryGrantWarningInfoBinder = MemoryGrantWarningInfoBinder;
// #region RelOp
function ConstantScanTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.Values) {
        node.nameSet.push("Values");
        for (const rows of item.Values) {
            if (rows) {
                for (const row of rows) {
                    node.nameSet.push(saxformat_1.formatScalar(node, row));
                }
            }
        }
    }
}
exports.ConstantScanTypeBinder = ConstantScanTypeBinder;
function FilterTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.Predicate && item.Predicate.ScalarOperator) {
        const formatter = saxformat_1.formatScalar(node, item.Predicate.ScalarOperator);
        node.nameSet.push(() => {
            return formatter();
        });
    }
}
exports.FilterTypeBinder = FilterTypeBinder;
function ParallelismTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.Activation !== undefined) {
        const actObj = formatObject(item.Activation.Object);
        if (actObj) {
            node.nameSet.push("Activation");
            node.nameSet.push(actObj);
            if (item.Activation.Type) {
                node.nameSet.push(item.Activation.Type);
            }
            if (item.Activation.FragmentElimination) {
                node.nameSet.push(item.Activation.FragmentElimination);
            }
        }
    }
    if (item.BrickRouting !== undefined) {
        const actObj = formatObject(item.BrickRouting.Object);
        if (actObj) {
            node.nameSet.push("Brick Routing");
            node.nameSet.push(actObj);
            if (item.BrickRouting.FragmentIdColumn && item.BrickRouting.FragmentIdColumn.ColumnReference) {
                const idc = node.dataInfo.getColumn(item.BrickRouting.FragmentIdColumn.ColumnReference);
                node.nameSet.push(() => { return idc.displayName; });
            }
        }
    }
    function formatObject(obj) {
        if (obj) {
            const tb = node.dataInfo.getTable(obj);
            if (tb) {
                return () => { return tb.displayName; };
            }
        }
    }
}
exports.ParallelismTypeBinder = ParallelismTypeBinder;
function PutTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    RemoteQueryTypeBinder(node, bindAs, item);
    let shuffle = false;
    if (item.ShuffleType) {
        node.nameSet.push("SHUFFLE");
        shuffle = true;
        node.nameSet.push(item.ShuffleType);
    }
    if (item.ShuffleColumn) {
        if (!shuffle) {
            node.nameSet.push("SHUFFLE");
        }
        node.nameSet.push(item.ShuffleColumn);
    }
}
exports.PutTypeBinder = PutTypeBinder;
function RemoteTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.RemoteSource) {
        node.nameSet.push(item.RemoteSource);
    }
    if (item.RemoteDestination) {
        node.nameSet.push(item.RemoteDestination);
    }
    if (item.RemoteObject) {
        node.nameSet.push(item.RemoteObject);
    }
}
exports.RemoteTypeBinder = RemoteTypeBinder;
function RemoteFetchTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    RemoteTypeBinder(node, bindAs, item);
}
exports.RemoteFetchTypeBinder = RemoteFetchTypeBinder;
function RemoteModifyTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    RemoteTypeBinder(node, bindAs, item);
}
exports.RemoteModifyTypeBinder = RemoteModifyTypeBinder;
function RemoteRangeTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    RemoteTypeBinder(node, bindAs, item);
}
exports.RemoteRangeTypeBinder = RemoteRangeTypeBinder;
function RemoteQueryTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    RemoteTypeBinder(node, bindAs, item);
    if (item.RemoteQuery) {
        node.nameSet.push(item.RemoteQuery);
    }
}
exports.RemoteQueryTypeBinder = RemoteQueryTypeBinder;
function SegmentTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.SegmentColumn !== undefined && item.SegmentColumn.ColumnReference !== undefined) {
        const column = node.dataInfo.getColumn(item.SegmentColumn.ColumnReference);
        node.nameSet.push(() => { return "BY: " + column.displayName; });
    }
}
exports.SegmentTypeBinder = SegmentTypeBinder;
function SortTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.PartitionId !== undefined && item.PartitionId.ColumnReference !== undefined) {
        const column = node.dataInfo.getColumn(item.PartitionId.ColumnReference);
        node.nameSet.push(() => { return "PARTITIONED BY " + column.displayName; });
    }
}
exports.SortTypeBinder = SortTypeBinder;
function SplitTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.ActionColumn !== undefined && item.ActionColumn.ColumnReference !== undefined) {
        const column = node.dataInfo.getColumn(item.ActionColumn.ColumnReference);
        node.nameSet.push(() => { return "BY: " + column.displayName; });
    }
}
exports.SplitTypeBinder = SplitTypeBinder;
function StreamAggregateTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.RollupInfo) {
        const parts = [];
        let sep = "Rollup: (";
        for (const rl of item.RollupInfo.RollupLevel) {
            if (rl !== undefined && rl.Level !== undefined) {
                parts.push(sep);
                parts.push(rl.Level.toString());
                sep = ", ";
            }
        }
        if (item.RollupInfo.HighestLevel !== undefined) {
            parts.push("...");
            parts.push(item.RollupInfo.HighestLevel.toString());
        }
        node.nameSet.push(parts.join(""));
    }
}
exports.StreamAggregateTypeBinder = StreamAggregateTypeBinder;
function TableScanTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.IndexedViewInfo != undefined && item.IndexedViewInfo.length > 0) {
        node.nameSet.push("Indexed View");
        for (const iv of item.IndexedViewInfo) {
            const ivi = node.dataInfo.getTable(iv);
            if (ivi) {
                node.nameSet.push(() => ivi.displayName);
            }
        }
    }
}
exports.TableScanTypeBinder = TableScanTypeBinder;
function TopSortTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    const sb = new stringBuilder_1.StringBuilder();
    if (item.Rows != undefined) {
        sb.append(item.Rows);
        sb.append("ROWS");
    }
    if (item.WithTies) {
        sb.append("WITH TIES");
    }
    if (!sb.isEmpty) {
        node.nameSet.push(() => { return sb.format(" "); });
    }
    SortTypeBinder(node, bindAs, item);
}
exports.TopSortTypeBinder = TopSortTypeBinder;
function TopTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    let topKeyword = "TOP";
    if (item.OffsetExpression && item.OffsetExpression.ScalarOperator) {
        const offset = (new stringBuilder_1.StringBuilder("OFFSET", saxformat_1.formatScalar(node, item.OffsetExpression.ScalarOperator, tryFormatNumber)));
        node.nameSet.push(() => { return offset.format(" "); });
        topKeyword = "FETCH";
    }
    if (item.TopExpression && item.TopExpression.ScalarOperator) {
        const top = (new stringBuilder_1.StringBuilder(topKeyword, saxformat_1.formatScalar(node, item.TopExpression.ScalarOperator, tryFormatNumber)));
        if (item.IsPercent) {
            top.append("PERCENT");
        }
        node.nameSet.push(() => { return top.format(" "); });
        if (item.WithTies) {
            const ties = new stringBuilder_1.StringBuilder("WITH TIES");
            let sep = "ON";
            if (item.TieColumns && item.TieColumns.length > 0) {
                for (const column of item.TieColumns) {
                    ties.append(sep);
                    sep = ",";
                    const col = node.dataInfo.getColumn(column);
                    ties.append(() => {
                        return col.displayName;
                    });
                }
            }
            node.nameSet.push(() => { return ties.format(" "); });
        }
    }
}
exports.TopTypeBinder = TopTypeBinder;
function TableValuedFunctionTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.Object) {
        const obj = node.dataInfo.getTable(item.Object);
        if (obj) {
            const nm = new stringBuilder_1.StringBuilder(() => obj.displayName);
            if (item.ParameterList) {
                let sep = "(";
                for (const param of item.ParameterList) {
                    nm.append(sep);
                    sep = ", ";
                    nm.append(saxformat_1.formatScalar(node, param));
                }
            }
            else {
                nm.append("(");
            }
            nm.append(")");
            node.nameSet.push(() => nm.format(""));
        }
    }
}
exports.TableValuedFunctionTypeBinder = TableValuedFunctionTypeBinder;
function RunTimePartitionSummaryTypeBinder(node, bindAs, item) {
    if (!item || !item.PartitionsAccessed)
        return;
    if (item.PartitionsAccessed.PartitionCount) {
        node.metrics.add("Partitions", "Partition Count", item.PartitionsAccessed.PartitionCount, 0);
    }
    if (item.PartitionsAccessed.PartitionRange) {
        const pr = item.PartitionsAccessed.PartitionRange;
        const prs = [];
        for (let index = 0; index < pr.length; index++) {
            const pp = pr[index];
            let val = (pp.Start === undefined) ?
                ((pp.End !== undefined) ?
                    `to ${pp.End}` : undefined) : ((pp.End === undefined) ?
                `from ${pp.Start}` : `${pp.Start} to ${pp.End}`);
            if (val) {
                prs.push();
            }
        }
        if (prs.length > 0) {
            node.metrics.add("Partitions", "Range", prs, 0);
        }
    }
}
exports.RunTimePartitionSummaryTypeBinder = RunTimePartitionSummaryTypeBinder;
function ThreadStatTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    if (item.Branches) {
        node.metrics.add("Thread Statistics", "Branches", item.Branches, 0);
    }
    if (item.UsedThreads) {
        node.metrics.add("Thread Statistics", "Used Threads", item.UsedThreads, 0);
    }
    if (item.ThreadReservation) {
        const trs = item.ThreadReservation;
        for (let index = 0; index < trs.length; index++) {
            const tr = trs[index];
            if (tr.NodeId !== undefined) {
                node.metrics.add("Thread Statistics", "Node ID", tr.NodeId, index);
            }
            if (tr.ReservedThreads !== undefined) {
                node.metrics.add("Thread Statistics", "Reserved Threads", tr.ReservedThreads, index);
            }
        }
    }
}
exports.ThreadStatTypeBinder = ThreadStatTypeBinder;
function MissingIndexesTypeBinder(node, bindAs, item) {
    if (!item || item.length === 0)
        return;
    const sc = new stringBuilder_1.StringBuilder();
    for (const mi of item) {
        sc.append(`-- The Query Processor estimates that implementing the following ${mi.MissingIndex.length > 1 ? "indicies" : "index"} could improve the query cost`);
        if (mi.Impact) {
            sc.append(`-- by ${mi.Impact} %`);
        }
        sc.append("");
        for (const index of mi.MissingIndex) {
            if (index.Database) {
                sc.append("USE " + index.Database);
                sc.append("GO");
            }
            sc.append("CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>]");
            sc.append("ON");
            let inm = "";
            if (index.Schema) {
                inm = index.Schema + ".";
            }
            if (index.Table) {
                inm += index.Table;
            }
            sc.append(inm);
            const eqs = [];
            const neqs = [];
            const incl = [];
            for (const cg of index.ColumnGroup) {
                let ar;
                switch (cg.Usage) {
                    case "EQUALITY":
                        ar = eqs;
                        break;
                    case "INEQUALITY":
                        ar = neqs;
                        break;
                    case "INCLUDE":
                        ar = incl;
                        break;
                    default:
                        continue;
                }
                if (ar) {
                    for (const col of cg.Column) {
                        if (col && col.Name) {
                            ar.push(col.Name);
                        }
                    }
                }
            }
            sc.append("(" + eqs.concat(neqs).join(", ") + ")");
            if (incl.length > 0) {
                sc.append("INCLUDE (" + incl.join(', ') + ")");
            }
            sc.append("GO");
            sc.append("");
        }
    }
    node.missingIndexText = sc.format("\r\n");
}
exports.MissingIndexesTypeBinder = MissingIndexesTypeBinder;
function GuessedSelectivityTypeBinder(node, bindAs, item) {
    if (!item || !item.Spatial)
        return;
    const tb = node.dataInfo.getTable(item.Spatial);
    if (tb) {
        node.metrics.add("General", "Guessed Selectivity", () => tb.displayName, 0);
    }
}
exports.GuessedSelectivityTypeBinder = GuessedSelectivityTypeBinder;
function UnmatchedIndexesTypeBinder(node, bindAs, item) {
    if (!item || !item.Parameterization)
        return;
    const prs = [];
    for (const p of item.Parameterization) {
        const tb = node.dataInfo.getTable(p);
        if (tb) {
            prs.push(() => tb.displayName);
        }
    }
    if (prs.length > 0) {
        node.metrics.add("Unmatched Indexes", "Parametarization", prs, 0);
    }
}
exports.UnmatchedIndexesTypeBinder = UnmatchedIndexesTypeBinder;
function OptimizerStatsUsageTypeBinder(node, bindAs, item) {
    if (!item)
        return;
    for (const p of item) {
        const tableName = {
            Database: p.Database,
            Schema: p.Schema,
            Table: p.Table
        };
        const table = node.dataInfo.getTable(tableName);
        if (table) {
            const category = () => "Statistics for " + table.displayName;
            if (p.Statistics) {
                node.metrics.add(category, "Statistics", p.Statistics, 0);
            }
            if (p.SamplingPercent) {
                node.metrics.add(category, "Sampling Percent", p.SamplingPercent, 0);
            }
            if (p.ModificationCount) {
                node.metrics.add(category, "Modification Count", p.ModificationCount, 0);
            }
            if (p.LastUpdate) {
                node.metrics.add(category, "Last Update", p.LastUpdate, 0);
            }
        }
    }
}
exports.OptimizerStatsUsageTypeBinder = OptimizerStatsUsageTypeBinder;
function TraceFlagListTypeBinder(node, bindAs, items) {
    if (!items)
        return;
    for (const item of items) {
        const suffix = (item.IsCompileTime) ? " (compile time)" : "";
        for (const flag of item.TraceFlag) {
            node.metrics.add("Trace", ((flag.Scope) ? flag.Scope : "") + suffix, flag.Value, 0);
        }
    }
}
exports.TraceFlagListTypeBinder = TraceFlagListTypeBinder;
function WaitStatListTypeBinder(node, bindAs, items) {
    if (!items)
        return;
    for (const item of items) {
        if (item.WaitType !== undefined) {
            let val = item.WaitTimeMs + "ms";
            if (item.WaitCount !== undefined && item.WaitCount > 1) {
                val += " x " + item.WaitCount;
            }
            node.metrics.add("Wait Statistics", item.WaitType, val, 0);
        }
    }
}
exports.WaitStatListTypeBinder = WaitStatListTypeBinder;
// #endregion
const formatNumberReg = /\s*\(?\s*([\d\+\-eE\.]+)/i;
function tryFormatNumber(value) {
    const res = formatNumberReg.exec(value);
    if (res) {
        const pn = parseFloat(res[1]);
        if (!isNaN(pn)) {
            return "(" + pn + ")";
        }
    }
    if (value[0] !== "(") {
        value = "(" + value;
    }
    if (value[value.length - 1] !== ")") {
        value = value + ")";
    }
    return value;
}
function nameSetTitle(node, title, subTitle) {
    let iconTemplate = 'pi_default';
    if (title) {
        if (title !== subTitle) {
            node.nameSet.unshift(title);
            //node.nameSet.push(title);
        }
        const nameTemplate = 'pi_' + title.replace(/\s/g, '_').toLowerCase();
        if (iconTemplates[nameTemplate]) {
            iconTemplate = nameTemplate;
        }
    }
    if (subTitle) {
        node.nameSet.unshift(subTitle);
        //node.nameSet.push(subTitle);
    }
    node.iconTemplate = iconTemplate;
}
exports.nameSetTitle = nameSetTitle;
const iconTemplates = {
    "pi_arithmetic_expression": true,
    "pi_assert": true,
    "pi_assign": true,
    "pi_batch_hash_table_build": true,
    "pi_bitmap": true,
    "pi_bookmark_lookup": true,
    "pi_clustered_index_delete": true,
    "pi_clustered_index_insert": true,
    "pi_clustered_index_merge": true,
    "pi_clustered_index_scan": true,
    "pi_clustered_index_seek": true,
    "pi_clustered_index_spool": true,
    "pi_clustered_index_update": true,
    "pi_collapse": true,
    "pi_columnstore_index_scan": true,
    "pi_compute_scalar": true,
    "pi_concatenation": true,
    "pi_constant_scan": true,
    "pi_convert": true,
    "pi_cursor_catch_all": true,
    "pi_declare": true,
    "pi_default": true,
    "pi_delay": true,
    "pi_delete": true,
    "pi_deleted_scan": true,
    "pi_dynamic": true,
    "pi_fetch_query": true,
    "pi_filter": true,
    "pi_hash_match_root": true,
    "pi_hash_match_team": true,
    "pi_hash_match": true,
    "pi_if": true,
    "pi_index_delete": true,
    "pi_index_insert": true,
    "pi_index_merge": true,
    "pi_index_scan": true,
    "pi_index_seek": true,
    "pi_index_spool": true,
    "pi_index_update": true,
    "pi_inserted_scan": true,
    "pi_intrinsic": true,
    "pi_iterator_catch_all": true,
    "pi_keyset": true,
    "pi_log_row_scan": true,
    "pi_merge_interval": true,
    "pi_merge_join": true,
    "pi_nested_loops": true,
    "pi_parallelism_distribute": true,
    "pi_parallelism_repartition": true,
    "pi_parallelism": true,
    "pi_parameter_table_scan": true,
    "pi_population_query": true,
    "pi_print": true,
    "pi_rank": true,
    "pi_refresh_query": true,
    "pi_remote_count_spool": true,
    "pi_remote_delete": true,
    "pi_remote_index_scan": true,
    "pi_remote_index_seek": true,
    "pi_remote_insert": true,
    "pi_remote_query": true,
    "pi_remote_scan": true,
    "pi_remote_update": true,
    "pi_result": true,
    "pi_rid_clustered_locate": true,
    "pi_rid_nonclustered_locate": true,
    "pi_segment": true,
    "pi_select": true,
    "pi_sequence_project": true,
    "pi_sequence": true,
    "pi_set_function": true,
    "pi_snapshot": true,
    "pi_sort": true,
    "pi_split": true,
    "pi_spool": true,
    "pi_stream_aggregate": true,
    "pi_switch": true,
    "pi_table_delete": true,
    "pi_table_insert": true,
    "pi_table_merge": true,
    "pi_table_scan": true,
    "pi_table_spool": true,
    "pi_table_update": true,
    "pi_table-value_function": true,
    "pi_table-valued_function": true,
    "pi_top": true,
    "pi_udx": true,
    "pi_update": true,
    "pi_workfile_scan": true
};
//# sourceMappingURL=binders.js.map