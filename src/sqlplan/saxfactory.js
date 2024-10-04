"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const binders = require("./binders");
exports.rootFactory = ShowPlanXMLFactory;
function baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(data) {
    if (data) {
        switch (data) {
            case "TimeOut": return "Time Out";
            case "MemoryLimitExceeded": return "Memory Limit Exceeded";
            case "GoodEnoughPlanFound": return "Good Enough Plan Found";
        }
    }
    return data;
}
function cursorPlanTypeOperationOperationTypeEnum(data) {
    if (data) {
        switch (data) {
            case "FetchQuery": return "Fetch Query";
            case "PopulateQuery": return "Populate Query";
            case "RefreshQuery": return "Refresh Query";
        }
    }
    return data;
}
function receivePlanTypeOperationOperationTypeEnum(data) {
    if (data) {
        switch (data) {
            case "ReceivePlanSelect": return "Receive Plan Select";
            case "ReceivePlanUpdate": return "Receive Plan Update";
        }
    }
    return data;
}
function parallelismTypeActivationTypeEnum(data) {
    if (data) {
        switch (data) {
            case "CloneLocation": return "Clone Location";
            case "SingleBrick": return "Single Brick";
        }
    }
    return data;
}
function storageType(data) {
    if (data) {
        switch (data) {
            case "RowStore": return "Row Store";
            case "ColumnStore": return "Column Store";
            case "MemoryOptimized": return "Memory Optimized";
        }
    }
    return data;
}
function cursorType(data) {
    if (data) {
        switch (data) {
            case "FastForward": return "Fast Forward";
            case "SnapShot": return "Snap Shot";
        }
    }
    return data;
}
function partitionType(data) {
    if (data) {
        switch (data) {
            case "NoPartitioning": return "No Partitioning";
            case "RoundRobin": return "Round Robin";
            case "CloneLocation": return "Clone Location";
        }
    }
    return data;
}
function logicalOperationType(data) {
    if (data) {
        switch (data) {
            case "IsFalseOrNull": return "Is False Or Null";
        }
    }
    return data;
}
function logicalOpType(data) {
    if (data) {
        switch (data) {
            case "GbAgg": return "Gb Agg";
            case "GbApply": return "Gb Apply";
            case "LocalCube": return "Local Cube";
            case "Table-valued function": return "Table-valued Function";
            case "TopN Sort": return "Top N Sort";
        }
    }
    return data;
}
function physicalOpType(data) {
    if (data) {
        switch (data) {
            case "GbAgg": return "Gb Agg";
            case "GbApply": return "Gb Apply";
            case "LocalCube": return "Local Cube";
            case "Table-valued function": return "Table-valued Function";
        }
    }
    return data;
}
function indexKindType(data) {
    if (data) {
        switch (data) {
            case "FTSChangeTracking": return "FTS Change Tracking";
            case "FTSMapping": return "FTS Mapping";
            case "NonClustered": return "Non Clustered";
            case "PrimaryXML": return "Primary XML";
            case "SecondaryXML": return "Secondary XML";
            case "ViewClustered": return "View Clustered";
            case "ViewNonClustered": return "View Non Clustered";
            case "NonClusteredHash": return "Non Clustered Hash";
            case "SelectiveXML": return "Selective XML";
            case "SecondarySelectiveXML": return "Secondary Selective XML";
        }
    }
    return data;
}
function cloneAccessScopeType(data) {
    if (data) {
        switch (data) {
            case "ExactMatch": return "Exact Match";
        }
    }
    return data;
}
function int(data) {
    if (data !== undefined) {
        return parseInt(data);
    }
}
function float(data) {
    if (data !== undefined) {
        return parseFloat(data);
    }
}
function onoff(data) { return bool(data) ? "ON" : "OFF"; }
function bool(data) {
    if (data) {
        data = data.toLowerCase();
        if (data === "yes")
            return true;
        if (data === "true")
            return true;
        if (data === "1")
            return true;
    }
    return false;
}
function BaseStmtInfoTypeFactory(context, element) {
    const item = element.attributes;
    item.StatementCompId = int(element.attributes.StatementCompId);
    item.StatementEstRows = float(element.attributes.StatementEstRows);
    item.StatementId = int(element.attributes.StatementId);
    item.QueryCompilationReplay = int(element.attributes.QueryCompilationReplay);
    item.StatementOptmEarlyAbortReason = baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(element.attributes.StatementOptmEarlyAbortReason);
    item.StatementSubTreeCost = float(element.attributes.StatementSubTreeCost);
    item.DatabaseContextSettingsId = int(element.attributes.DatabaseContextSettingsId);
    item.ParentObjectId = int(element.attributes.ParentObjectId);
    item.StatementParameterizationType = int(element.attributes.StatementParameterizationType);
    item.SecurityPolicyApplied = bool(element.attributes.SecurityPolicyApplied);
    item.BatchModeOnRowStoreUsed = bool(element.attributes.BatchModeOnRowStoreUsed);
    item.QueryStoreStatementHintId = int(element.attributes.QueryStoreStatementHintId);
    item.ContainsLedgerTables = bool(element.attributes.ContainsLedgerTables);
    context.startElement({
        isStatement: true,
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value) => { item.StatementSetOptions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.StatementType, item.StatementType);
                planNode.metrics.add("General", "Statement Comp Id", item.StatementCompId, 0);
                planNode.metrics.add("General", "Statement Est Rows", item.StatementEstRows);
                planNode.metrics.add("General", "Statement Id", item.StatementId, 0);
                planNode.metrics.add("General", "Query Compilation Replay", item.QueryCompilationReplay, 0);
                planNode.metrics.add("General", `Optimization Level`, item.StatementOptmLevel, 0);
                planNode.metrics.add("General", `Early Abort Reason`, item.StatementOptmEarlyAbortReason, 0);
                planNode.metrics.add("General", "Cardinality Estimation Model Version", item.CardinalityEstimationModelVersion, 0);
                planNode.metrics.add("General", "Statement Sub Tree Cost", item.StatementSubTreeCost, 0);
                planNode.metrics.add("General", "Statement Type", item.StatementType, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide DB", item.TemplatePlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide Name", item.TemplatePlanGuideName, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide DB", item.PlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide Name", item.PlanGuideName, 0);
                planNode.metrics.add("Parameterization", "Parameterized Text", item.ParameterizedText, 0);
                planNode.metrics.add("Parameterization", "Parameterized Plan Handle", item.ParameterizedPlanHandle, 0);
                planNode.metrics.add("General", "Query Hash", item.QueryHash, 0);
                planNode.metrics.add("General", "Query Plan Hash", item.QueryPlanHash, 0);
                planNode.metrics.add("General", "Retrieved From Cache", item.RetrievedFromCache, 0);
                planNode.metrics.add("General", "Statement Sql Handle", item.StatementSqlHandle, 0);
                planNode.metrics.add("General", "Database Context Settings Id", item.DatabaseContextSettingsId, 0);
                planNode.metrics.add("General", "Parent Object Id", item.ParentObjectId, 0);
                planNode.metrics.add("General", "Batch Sql Handle", item.BatchSqlHandle, 0);
                planNode.metrics.add("General", "Statement Parameterization Type", item.StatementParameterizationType, 0);
                planNode.metrics.add("General", "Security Policy Applied", item.SecurityPolicyApplied, 0);
                planNode.metrics.add("General", "Batch Mode On Row Store Used", item.BatchModeOnRowStoreUsed, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Id", item.QueryStoreStatementHintId, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Text", item.QueryStoreStatementHintText, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Source", item.QueryStoreStatementHintSource, 0);
                planNode.metrics.add("General", "Contains Ledger Tables", item.ContainsLedgerTables, 0);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setStatementSubTreeCost(item.StatementSubTreeCost);
                statement.setStatementText(item.StatementText);
            }
        }
    });
}
function RelOpBaseTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RowsetTypeFactory(context, element) {
    const item = element.attributes;
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SortTypeFactory(context, element) {
    const item = element.attributes;
    item.Distinct = bool(element.attributes.Distinct);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "OrderBy": {
                initializer: OrderByTypeFactory,
                setter: (value) => { item.OrderBy = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Distinct) {
                    planNode.flags.push("Distinct");
                }
                binders.OrderByTypeBinder(planNode, "orderby", item.OrderBy);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ConcatTypeFactory(context, element) {
    const item = element.attributes;
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RemoteTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RemoteQueryTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ScalarExpressionTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ExternalDistributedComputationTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "StmtSimple": {
                initializer: StmtSimpleTypeFactory,
                setter: (value) => { item.StmtSimple = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtBlockTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ExternalDistributedComputation": {
                initializer: ExternalDistributedComputationTypeFactory,
                setter: (value) => { item.ExternalDistributedComputation = value; }
            },
            "StmtSimple": {
                initializer: StmtSimpleTypeFactory,
                setter: (value) => { item.StmtSimple = value; }
            },
            "StmtCond": {
                initializer: StmtCondTypeFactory,
                setter: (value) => { item.StmtCond = value; }
            },
            "StmtCursor": {
                initializer: StmtCursorTypeFactory,
                setter: (value) => { item.StmtCursor = value; }
            },
            "StmtReceive": {
                initializer: StmtReceiveTypeFactory,
                setter: (value) => { item.StmtReceive = value; }
            },
            "StmtUseDb": {
                initializer: StmtUseDbTypeFactory,
                setter: (value) => { item.StmtUseDb = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtSimpleTypeFactory(context, element) {
    const item = element.attributes;
    item.StatementCompId = int(element.attributes.StatementCompId);
    item.StatementEstRows = float(element.attributes.StatementEstRows);
    item.StatementId = int(element.attributes.StatementId);
    item.QueryCompilationReplay = int(element.attributes.QueryCompilationReplay);
    item.StatementOptmEarlyAbortReason = baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(element.attributes.StatementOptmEarlyAbortReason);
    item.StatementSubTreeCost = float(element.attributes.StatementSubTreeCost);
    item.DatabaseContextSettingsId = int(element.attributes.DatabaseContextSettingsId);
    item.ParentObjectId = int(element.attributes.ParentObjectId);
    item.StatementParameterizationType = int(element.attributes.StatementParameterizationType);
    item.SecurityPolicyApplied = bool(element.attributes.SecurityPolicyApplied);
    item.BatchModeOnRowStoreUsed = bool(element.attributes.BatchModeOnRowStoreUsed);
    item.QueryStoreStatementHintId = int(element.attributes.QueryStoreStatementHintId);
    item.ContainsLedgerTables = bool(element.attributes.ContainsLedgerTables);
    item.UDF = [];
    context.startElement({
        isStatement: true,
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Dispatcher": {
                initializer: DispatcherTypeFactory,
                setter: (value) => { item.Dispatcher = value; }
            },
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value) => { item.QueryPlan = value; }
            },
            "UDF": {
                initializer: FunctionTypeFactory,
                setter: (value) => { item.UDF.push(value); }
            },
            "StoredProc": {
                initializer: FunctionTypeFactory,
                setter: (value) => { item.StoredProc = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value) => { item.StatementSetOptions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.StatementType, item.StatementType);
                planNode.metrics.add("General", "Statement Comp Id", item.StatementCompId, 0);
                planNode.metrics.add("General", "Statement Est Rows", item.StatementEstRows);
                planNode.metrics.add("General", "Statement Id", item.StatementId, 0);
                planNode.metrics.add("General", "Query Compilation Replay", item.QueryCompilationReplay, 0);
                planNode.metrics.add("General", `Optimization Level`, item.StatementOptmLevel, 0);
                planNode.metrics.add("General", `Early Abort Reason`, item.StatementOptmEarlyAbortReason, 0);
                planNode.metrics.add("General", "Cardinality Estimation Model Version", item.CardinalityEstimationModelVersion, 0);
                planNode.metrics.add("General", "Statement Sub Tree Cost", item.StatementSubTreeCost, 0);
                planNode.metrics.add("General", "Statement Type", item.StatementType, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide DB", item.TemplatePlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide Name", item.TemplatePlanGuideName, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide DB", item.PlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide Name", item.PlanGuideName, 0);
                planNode.metrics.add("Parameterization", "Parameterized Text", item.ParameterizedText, 0);
                planNode.metrics.add("Parameterization", "Parameterized Plan Handle", item.ParameterizedPlanHandle, 0);
                planNode.metrics.add("General", "Query Hash", item.QueryHash, 0);
                planNode.metrics.add("General", "Query Plan Hash", item.QueryPlanHash, 0);
                planNode.metrics.add("General", "Retrieved From Cache", item.RetrievedFromCache, 0);
                planNode.metrics.add("General", "Statement Sql Handle", item.StatementSqlHandle, 0);
                planNode.metrics.add("General", "Database Context Settings Id", item.DatabaseContextSettingsId, 0);
                planNode.metrics.add("General", "Parent Object Id", item.ParentObjectId, 0);
                planNode.metrics.add("General", "Batch Sql Handle", item.BatchSqlHandle, 0);
                planNode.metrics.add("General", "Statement Parameterization Type", item.StatementParameterizationType, 0);
                planNode.metrics.add("General", "Security Policy Applied", item.SecurityPolicyApplied, 0);
                planNode.metrics.add("General", "Batch Mode On Row Store Used", item.BatchModeOnRowStoreUsed, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Id", item.QueryStoreStatementHintId, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Text", item.QueryStoreStatementHintText, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Source", item.QueryStoreStatementHintSource, 0);
                planNode.metrics.add("General", "Contains Ledger Tables", item.ContainsLedgerTables, 0);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setStatementSubTreeCost(item.StatementSubTreeCost);
                statement.setStatementText(item.StatementText);
            }
        }
    });
}
function StmtUseDbTypeFactory(context, element) {
    const item = element.attributes;
    item.StatementCompId = int(element.attributes.StatementCompId);
    item.StatementEstRows = float(element.attributes.StatementEstRows);
    item.StatementId = int(element.attributes.StatementId);
    item.QueryCompilationReplay = int(element.attributes.QueryCompilationReplay);
    item.StatementOptmEarlyAbortReason = baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(element.attributes.StatementOptmEarlyAbortReason);
    item.StatementSubTreeCost = float(element.attributes.StatementSubTreeCost);
    item.DatabaseContextSettingsId = int(element.attributes.DatabaseContextSettingsId);
    item.ParentObjectId = int(element.attributes.ParentObjectId);
    item.StatementParameterizationType = int(element.attributes.StatementParameterizationType);
    item.SecurityPolicyApplied = bool(element.attributes.SecurityPolicyApplied);
    item.BatchModeOnRowStoreUsed = bool(element.attributes.BatchModeOnRowStoreUsed);
    item.QueryStoreStatementHintId = int(element.attributes.QueryStoreStatementHintId);
    item.ContainsLedgerTables = bool(element.attributes.ContainsLedgerTables);
    context.startElement({
        isStatement: true,
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value) => { item.StatementSetOptions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.StatementType, item.Database);
                planNode.metrics.add("General", "Statement Comp Id", item.StatementCompId, 0);
                planNode.metrics.add("General", "Statement Est Rows", item.StatementEstRows);
                planNode.metrics.add("General", "Statement Id", item.StatementId, 0);
                planNode.metrics.add("General", "Query Compilation Replay", item.QueryCompilationReplay, 0);
                planNode.metrics.add("General", `Optimization Level`, item.StatementOptmLevel, 0);
                planNode.metrics.add("General", `Early Abort Reason`, item.StatementOptmEarlyAbortReason, 0);
                planNode.metrics.add("General", "Cardinality Estimation Model Version", item.CardinalityEstimationModelVersion, 0);
                planNode.metrics.add("General", "Statement Sub Tree Cost", item.StatementSubTreeCost, 0);
                planNode.metrics.add("General", "Statement Type", item.StatementType, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide DB", item.TemplatePlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide Name", item.TemplatePlanGuideName, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide DB", item.PlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide Name", item.PlanGuideName, 0);
                planNode.metrics.add("Parameterization", "Parameterized Text", item.ParameterizedText, 0);
                planNode.metrics.add("Parameterization", "Parameterized Plan Handle", item.ParameterizedPlanHandle, 0);
                planNode.metrics.add("General", "Query Hash", item.QueryHash, 0);
                planNode.metrics.add("General", "Query Plan Hash", item.QueryPlanHash, 0);
                planNode.metrics.add("General", "Retrieved From Cache", item.RetrievedFromCache, 0);
                planNode.metrics.add("General", "Statement Sql Handle", item.StatementSqlHandle, 0);
                planNode.metrics.add("General", "Database Context Settings Id", item.DatabaseContextSettingsId, 0);
                planNode.metrics.add("General", "Parent Object Id", item.ParentObjectId, 0);
                planNode.metrics.add("General", "Batch Sql Handle", item.BatchSqlHandle, 0);
                planNode.metrics.add("General", "Statement Parameterization Type", item.StatementParameterizationType, 0);
                planNode.metrics.add("General", "Security Policy Applied", item.SecurityPolicyApplied, 0);
                planNode.metrics.add("General", "Batch Mode On Row Store Used", item.BatchModeOnRowStoreUsed, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Id", item.QueryStoreStatementHintId, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Text", item.QueryStoreStatementHintText, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Source", item.QueryStoreStatementHintSource, 0);
                planNode.metrics.add("General", "Contains Ledger Tables", item.ContainsLedgerTables, 0);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setStatementSubTreeCost(item.StatementSubTreeCost);
                statement.setStatementText(item.StatementText);
            }
        }
    });
}
function StmtCondTypeFactory(context, element) {
    const item = element.attributes;
    item.StatementCompId = int(element.attributes.StatementCompId);
    item.StatementEstRows = float(element.attributes.StatementEstRows);
    item.StatementId = int(element.attributes.StatementId);
    item.QueryCompilationReplay = int(element.attributes.QueryCompilationReplay);
    item.StatementOptmEarlyAbortReason = baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(element.attributes.StatementOptmEarlyAbortReason);
    item.StatementSubTreeCost = float(element.attributes.StatementSubTreeCost);
    item.DatabaseContextSettingsId = int(element.attributes.DatabaseContextSettingsId);
    item.ParentObjectId = int(element.attributes.ParentObjectId);
    item.StatementParameterizationType = int(element.attributes.StatementParameterizationType);
    item.SecurityPolicyApplied = bool(element.attributes.SecurityPolicyApplied);
    item.BatchModeOnRowStoreUsed = bool(element.attributes.BatchModeOnRowStoreUsed);
    item.QueryStoreStatementHintId = int(element.attributes.QueryStoreStatementHintId);
    item.ContainsLedgerTables = bool(element.attributes.ContainsLedgerTables);
    context.startElement({
        isStatement: true,
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Condition": {
                initializer: StmtCondTypeConditionFactory,
                setter: (value) => { item.Condition = value; }
            },
            "Then": {
                initializer: StmtCondTypeThenFactory,
                setter: (value) => { item.Then = value; }
            },
            "Else": {
                initializer: StmtCondTypeElseFactory,
                setter: (value) => { item.Else = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value) => { item.StatementSetOptions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.StatementType, item.StatementType);
                planNode.metrics.add("General", "Statement Comp Id", item.StatementCompId, 0);
                planNode.metrics.add("General", "Statement Est Rows", item.StatementEstRows);
                planNode.metrics.add("General", "Statement Id", item.StatementId, 0);
                planNode.metrics.add("General", "Query Compilation Replay", item.QueryCompilationReplay, 0);
                planNode.metrics.add("General", `Optimization Level`, item.StatementOptmLevel, 0);
                planNode.metrics.add("General", `Early Abort Reason`, item.StatementOptmEarlyAbortReason, 0);
                planNode.metrics.add("General", "Cardinality Estimation Model Version", item.CardinalityEstimationModelVersion, 0);
                planNode.metrics.add("General", "Statement Sub Tree Cost", item.StatementSubTreeCost, 0);
                planNode.metrics.add("General", "Statement Type", item.StatementType, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide DB", item.TemplatePlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide Name", item.TemplatePlanGuideName, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide DB", item.PlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide Name", item.PlanGuideName, 0);
                planNode.metrics.add("Parameterization", "Parameterized Text", item.ParameterizedText, 0);
                planNode.metrics.add("Parameterization", "Parameterized Plan Handle", item.ParameterizedPlanHandle, 0);
                planNode.metrics.add("General", "Query Hash", item.QueryHash, 0);
                planNode.metrics.add("General", "Query Plan Hash", item.QueryPlanHash, 0);
                planNode.metrics.add("General", "Retrieved From Cache", item.RetrievedFromCache, 0);
                planNode.metrics.add("General", "Statement Sql Handle", item.StatementSqlHandle, 0);
                planNode.metrics.add("General", "Database Context Settings Id", item.DatabaseContextSettingsId, 0);
                planNode.metrics.add("General", "Parent Object Id", item.ParentObjectId, 0);
                planNode.metrics.add("General", "Batch Sql Handle", item.BatchSqlHandle, 0);
                planNode.metrics.add("General", "Statement Parameterization Type", item.StatementParameterizationType, 0);
                planNode.metrics.add("General", "Security Policy Applied", item.SecurityPolicyApplied, 0);
                planNode.metrics.add("General", "Batch Mode On Row Store Used", item.BatchModeOnRowStoreUsed, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Id", item.QueryStoreStatementHintId, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Text", item.QueryStoreStatementHintText, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Source", item.QueryStoreStatementHintSource, 0);
                planNode.metrics.add("General", "Contains Ledger Tables", item.ContainsLedgerTables, 0);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setStatementSubTreeCost(item.StatementSubTreeCost);
                statement.setStatementText(item.StatementText);
            }
        }
    });
}
function StmtCursorTypeFactory(context, element) {
    const item = element.attributes;
    item.StatementCompId = int(element.attributes.StatementCompId);
    item.StatementEstRows = float(element.attributes.StatementEstRows);
    item.StatementId = int(element.attributes.StatementId);
    item.QueryCompilationReplay = int(element.attributes.QueryCompilationReplay);
    item.StatementOptmEarlyAbortReason = baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(element.attributes.StatementOptmEarlyAbortReason);
    item.StatementSubTreeCost = float(element.attributes.StatementSubTreeCost);
    item.DatabaseContextSettingsId = int(element.attributes.DatabaseContextSettingsId);
    item.ParentObjectId = int(element.attributes.ParentObjectId);
    item.StatementParameterizationType = int(element.attributes.StatementParameterizationType);
    item.SecurityPolicyApplied = bool(element.attributes.SecurityPolicyApplied);
    item.BatchModeOnRowStoreUsed = bool(element.attributes.BatchModeOnRowStoreUsed);
    item.QueryStoreStatementHintId = int(element.attributes.QueryStoreStatementHintId);
    item.ContainsLedgerTables = bool(element.attributes.ContainsLedgerTables);
    context.startElement({
        isStatement: true,
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "CursorPlan": {
                initializer: CursorPlanTypeFactory,
                setter: (value) => { item.CursorPlan = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value) => { item.StatementSetOptions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.StatementType, item.StatementType);
                planNode.metrics.add("General", "Statement Comp Id", item.StatementCompId, 0);
                planNode.metrics.add("General", "Statement Est Rows", item.StatementEstRows);
                planNode.metrics.add("General", "Statement Id", item.StatementId, 0);
                planNode.metrics.add("General", "Query Compilation Replay", item.QueryCompilationReplay, 0);
                planNode.metrics.add("General", `Optimization Level`, item.StatementOptmLevel, 0);
                planNode.metrics.add("General", `Early Abort Reason`, item.StatementOptmEarlyAbortReason, 0);
                planNode.metrics.add("General", "Cardinality Estimation Model Version", item.CardinalityEstimationModelVersion, 0);
                planNode.metrics.add("General", "Statement Sub Tree Cost", item.StatementSubTreeCost, 0);
                planNode.metrics.add("General", "Statement Type", item.StatementType, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide DB", item.TemplatePlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide Name", item.TemplatePlanGuideName, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide DB", item.PlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide Name", item.PlanGuideName, 0);
                planNode.metrics.add("Parameterization", "Parameterized Text", item.ParameterizedText, 0);
                planNode.metrics.add("Parameterization", "Parameterized Plan Handle", item.ParameterizedPlanHandle, 0);
                planNode.metrics.add("General", "Query Hash", item.QueryHash, 0);
                planNode.metrics.add("General", "Query Plan Hash", item.QueryPlanHash, 0);
                planNode.metrics.add("General", "Retrieved From Cache", item.RetrievedFromCache, 0);
                planNode.metrics.add("General", "Statement Sql Handle", item.StatementSqlHandle, 0);
                planNode.metrics.add("General", "Database Context Settings Id", item.DatabaseContextSettingsId, 0);
                planNode.metrics.add("General", "Parent Object Id", item.ParentObjectId, 0);
                planNode.metrics.add("General", "Batch Sql Handle", item.BatchSqlHandle, 0);
                planNode.metrics.add("General", "Statement Parameterization Type", item.StatementParameterizationType, 0);
                planNode.metrics.add("General", "Security Policy Applied", item.SecurityPolicyApplied, 0);
                planNode.metrics.add("General", "Batch Mode On Row Store Used", item.BatchModeOnRowStoreUsed, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Id", item.QueryStoreStatementHintId, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Text", item.QueryStoreStatementHintText, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Source", item.QueryStoreStatementHintSource, 0);
                planNode.metrics.add("General", "Contains Ledger Tables", item.ContainsLedgerTables, 0);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setStatementSubTreeCost(item.StatementSubTreeCost);
                statement.setStatementText(item.StatementText);
            }
        }
    });
}
function StmtReceiveTypeFactory(context, element) {
    const item = element.attributes;
    item.StatementCompId = int(element.attributes.StatementCompId);
    item.StatementEstRows = float(element.attributes.StatementEstRows);
    item.StatementId = int(element.attributes.StatementId);
    item.QueryCompilationReplay = int(element.attributes.QueryCompilationReplay);
    item.StatementOptmEarlyAbortReason = baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(element.attributes.StatementOptmEarlyAbortReason);
    item.StatementSubTreeCost = float(element.attributes.StatementSubTreeCost);
    item.DatabaseContextSettingsId = int(element.attributes.DatabaseContextSettingsId);
    item.ParentObjectId = int(element.attributes.ParentObjectId);
    item.StatementParameterizationType = int(element.attributes.StatementParameterizationType);
    item.SecurityPolicyApplied = bool(element.attributes.SecurityPolicyApplied);
    item.BatchModeOnRowStoreUsed = bool(element.attributes.BatchModeOnRowStoreUsed);
    item.QueryStoreStatementHintId = int(element.attributes.QueryStoreStatementHintId);
    item.ContainsLedgerTables = bool(element.attributes.ContainsLedgerTables);
    context.startElement({
        isStatement: true,
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "ReceivePlan": {
                initializer: ReceivePlanTypeFactory,
                setter: (value) => { item.ReceivePlan = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value) => { item.StatementSetOptions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.StatementType, item.StatementType);
                planNode.metrics.add("General", "Statement Comp Id", item.StatementCompId, 0);
                planNode.metrics.add("General", "Statement Est Rows", item.StatementEstRows);
                planNode.metrics.add("General", "Statement Id", item.StatementId, 0);
                planNode.metrics.add("General", "Query Compilation Replay", item.QueryCompilationReplay, 0);
                planNode.metrics.add("General", `Optimization Level`, item.StatementOptmLevel, 0);
                planNode.metrics.add("General", `Early Abort Reason`, item.StatementOptmEarlyAbortReason, 0);
                planNode.metrics.add("General", "Cardinality Estimation Model Version", item.CardinalityEstimationModelVersion, 0);
                planNode.metrics.add("General", "Statement Sub Tree Cost", item.StatementSubTreeCost, 0);
                planNode.metrics.add("General", "Statement Type", item.StatementType, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide DB", item.TemplatePlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Template Plan Guide Name", item.TemplatePlanGuideName, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide DB", item.PlanGuideDB, 0);
                planNode.metrics.add("Plan Guide", "Plan Guide Name", item.PlanGuideName, 0);
                planNode.metrics.add("Parameterization", "Parameterized Text", item.ParameterizedText, 0);
                planNode.metrics.add("Parameterization", "Parameterized Plan Handle", item.ParameterizedPlanHandle, 0);
                planNode.metrics.add("General", "Query Hash", item.QueryHash, 0);
                planNode.metrics.add("General", "Query Plan Hash", item.QueryPlanHash, 0);
                planNode.metrics.add("General", "Retrieved From Cache", item.RetrievedFromCache, 0);
                planNode.metrics.add("General", "Statement Sql Handle", item.StatementSqlHandle, 0);
                planNode.metrics.add("General", "Database Context Settings Id", item.DatabaseContextSettingsId, 0);
                planNode.metrics.add("General", "Parent Object Id", item.ParentObjectId, 0);
                planNode.metrics.add("General", "Batch Sql Handle", item.BatchSqlHandle, 0);
                planNode.metrics.add("General", "Statement Parameterization Type", item.StatementParameterizationType, 0);
                planNode.metrics.add("General", "Security Policy Applied", item.SecurityPolicyApplied, 0);
                planNode.metrics.add("General", "Batch Mode On Row Store Used", item.BatchModeOnRowStoreUsed, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Id", item.QueryStoreStatementHintId, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Text", item.QueryStoreStatementHintText, 0);
                planNode.metrics.add("General", "Query Store Statement Hint Source", item.QueryStoreStatementHintSource, 0);
                planNode.metrics.add("General", "Contains Ledger Tables", item.ContainsLedgerTables, 0);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setStatementSubTreeCost(item.StatementSubTreeCost);
                statement.setStatementText(item.StatementText);
            }
        }
    });
}
function FunctionTypeFactory(context, element) {
    const item = element.attributes;
    item.IsNativelyCompiled = bool(element.attributes.IsNativelyCompiled);
    context.startElement({
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value) => { item.Statements = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, item.ProcName);
                planNode.metrics.add("General", "Proc Name", item.ProcName, 0);
                planNode.metrics.add("General", "Is Natively Compiled", item.IsNativelyCompiled, 0);
            }
        }
    });
}
function CursorPlanTypeFactory(context, element) {
    const item = element.attributes;
    item.CursorActualType = cursorType(element.attributes.CursorActualType);
    item.CursorRequestedType = cursorType(element.attributes.CursorRequestedType);
    item.ForwardOnly = bool(element.attributes.ForwardOnly);
    item.Operation = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Operation": {
                initializer: CursorPlanTypeOperationFactory,
                setter: (value) => { item.Operation.push(value); }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, item.CursorName);
            }
        }
    });
}
function ReceivePlanTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Operation": {
                initializer: ReceivePlanTypeOperationFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function ColumnReferenceTypeFactory(context, element) {
    const item = element.attributes;
    item.ComputedColumn = bool(element.attributes.ComputedColumn);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SingleColumnReferenceTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.ColumnReference = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ColumnReferenceListTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function ScanRangeTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RangeColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.RangeColumns = value; }
            },
            "RangeExpressions": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value) => { item.RangeExpressions = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ColumnReferenceListTypeBinder(planNode, "range", item.RangeColumns);
            }
        }
    });
}
function SeekPredicateTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Prefix": {
                initializer: ScanRangeTypeFactory,
                setter: (value) => { item.Prefix = value; }
            },
            "StartRange": {
                initializer: ScanRangeTypeFactory,
                setter: (value) => { item.StartRange = value; }
            },
            "EndRange": {
                initializer: ScanRangeTypeFactory,
                setter: (value) => { item.EndRange = value; }
            },
            "IsNotNull": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.IsNotNull = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SeekPredicateNewTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "SeekKeys": {
                initializer: SeekPredicateTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function SeekPredicatePartTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function SeekPredicatesTypeFactory(context, element) {
    const item = element.attributes;
    item.SeekPredicate = [];
    item.SeekPredicateNew = [];
    item.SeekPredicatePart = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SeekPredicate": {
                initializer: SeekPredicateTypeFactory,
                setter: (value) => { item.SeekPredicate.push(value); }
            },
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value) => { item.SeekPredicateNew.push(value); }
            },
            "SeekPredicatePart": {
                initializer: SeekPredicatePartTypeFactory,
                setter: (value) => { item.SeekPredicatePart.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ObjectTypeFactory(context, element) {
    const item = element.attributes;
    item.Filtered = bool(element.attributes.Filtered);
    item.OnlineInbuildIndex = int(element.attributes.OnlineInbuildIndex);
    item.OnlineIndexBuildMappingIndex = int(element.attributes.OnlineIndexBuildMappingIndex);
    item.TableReferenceId = int(element.attributes.TableReferenceId);
    item.IndexKind = indexKindType(element.attributes.IndexKind);
    item.CloneAccessScope = cloneAccessScopeType(element.attributes.CloneAccessScope);
    item.Storage = storageType(element.attributes.Storage);
    item.GraphWorkTableType = int(element.attributes.GraphWorkTableType);
    item.GraphWorkTableIdentifier = int(element.attributes.GraphWorkTableIdentifier);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function OrderByTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "OrderByColumn": {
                initializer: OrderByTypeOrderByColumnFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function DefinedValuesListTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "DefinedValue": {
                initializer: DefinedValuesListTypeDefinedValueFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function SpillToTempDbTypeFactory(context, element) {
    const item = element.attributes;
    item.SpillLevel = int(element.attributes.SpillLevel);
    item.SpilledThreadCount = int(element.attributes.SpilledThreadCount);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function SortSpillDetailsTypeFactory(context, element) {
    const item = element.attributes;
    item.GrantedMemoryKb = int(element.attributes.GrantedMemoryKb);
    item.UsedMemoryKb = int(element.attributes.UsedMemoryKb);
    item.WritesToTempDb = int(element.attributes.WritesToTempDb);
    item.ReadsFromTempDb = int(element.attributes.ReadsFromTempDb);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function HashSpillDetailsTypeFactory(context, element) {
    const item = element.attributes;
    item.GrantedMemoryKb = int(element.attributes.GrantedMemoryKb);
    item.UsedMemoryKb = int(element.attributes.UsedMemoryKb);
    item.WritesToTempDb = int(element.attributes.WritesToTempDb);
    item.ReadsFromTempDb = int(element.attributes.ReadsFromTempDb);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function ExchangeSpillDetailsTypeFactory(context, element) {
    const item = element.attributes;
    item.WritesToTempDb = int(element.attributes.WritesToTempDb);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WaitWarningTypeFactory(context, element) {
    const item = element.attributes;
    item.WaitTime = int(element.attributes.WaitTime);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WaitStatTypeFactory(context, element) {
    const item = element.attributes;
    item.WaitTimeMs = int(element.attributes.WaitTimeMs);
    item.WaitCount = int(element.attributes.WaitCount);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WaitStatListTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Wait": {
                initializer: WaitStatTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function QueryExecTimeTypeFactory(context, element) {
    const item = element.attributes;
    item.CpuTime = int(element.attributes.CpuTime);
    item.ElapsedTime = int(element.attributes.ElapsedTime);
    item.UdfCpuTime = int(element.attributes.UdfCpuTime);
    item.UdfElapsedTime = int(element.attributes.UdfElapsedTime);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                planNode.metrics.add("Query Execution", `CPU Time`, item.CpuTime, 0);
                planNode.metrics.add("Query Execution", "Elapsed Time", item.ElapsedTime, 0);
                planNode.metrics.add("Query Execution", "Udf Cpu Time", item.UdfCpuTime, 0);
                planNode.metrics.add("Query Execution", "Udf Elapsed Time", item.UdfElapsedTime, 0);
            }
        }
    });
}
function AffectingConvertWarningTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WarningsTypeFactory(context, element) {
    const item = element.attributes;
    item.NoJoinPredicate = bool(element.attributes.NoJoinPredicate);
    item.SpatialGuess = bool(element.attributes.SpatialGuess);
    item.UnmatchedIndexes = bool(element.attributes.UnmatchedIndexes);
    item.FullUpdateForOnlineIndexBuild = bool(element.attributes.FullUpdateForOnlineIndexBuild);
    item.SpillToTempDb = [];
    item.Wait = [];
    item.PlanAffectingConvert = [];
    item.SortSpillDetails = [];
    item.HashSpillDetails = [];
    item.ExchangeSpillDetails = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SpillOccurred": {
                initializer: SpillOccurredTypeFactory,
                setter: (value) => { item.SpillOccurred = value; }
            },
            "ColumnsWithNoStatistics": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.ColumnsWithNoStatistics = value; }
            },
            "ColumnsWithStaleStatistics": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.ColumnsWithStaleStatistics = value; }
            },
            "SpillToTempDb": {
                initializer: SpillToTempDbTypeFactory,
                setter: (value) => { item.SpillToTempDb.push(value); }
            },
            "Wait": {
                initializer: WaitWarningTypeFactory,
                setter: (value) => { item.Wait.push(value); }
            },
            "PlanAffectingConvert": {
                initializer: AffectingConvertWarningTypeFactory,
                setter: (value) => { item.PlanAffectingConvert.push(value); }
            },
            "SortSpillDetails": {
                initializer: SortSpillDetailsTypeFactory,
                setter: (value) => { item.SortSpillDetails.push(value); }
            },
            "HashSpillDetails": {
                initializer: HashSpillDetailsTypeFactory,
                setter: (value) => { item.HashSpillDetails.push(value); }
            },
            "ExchangeSpillDetails": {
                initializer: ExchangeSpillDetailsTypeFactory,
                setter: (value) => { item.ExchangeSpillDetails.push(value); }
            },
            "MemoryGrantWarning": {
                initializer: MemoryGrantWarningInfoFactory,
                setter: (value) => { item.MemoryGrantWarning = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.SpillOccurredTypeBinder(planNode, "warning", item.SpillOccurred);
                binders.ColumnReferenceListTypeBinder(planNode, "warning_no_statistics", item.ColumnsWithNoStatistics);
                binders.ColumnReferenceListTypeBinder(planNode, "warning_no_statistics", item.ColumnsWithStaleStatistics);
                binders.SpillToTempDbTypeBinder(planNode, "warning", item.SpillToTempDb);
                binders.WaitWarningTypeBinder(planNode, "warning", item.Wait);
                binders.AffectingConvertWarningTypeBinder(planNode, "warning", item.PlanAffectingConvert);
                binders.SortSpillDetailsTypeBinder(planNode, "warning", item.SortSpillDetails);
                binders.HashSpillDetailsTypeBinder(planNode, "warning", item.HashSpillDetails);
                binders.ExchangeSpillDetailsTypeBinder(planNode, "warning", item.ExchangeSpillDetails);
                binders.MemoryGrantWarningInfoBinder(planNode, "warning", item.MemoryGrantWarning);
            }
        }
    });
}
function SpillOccurredTypeFactory(context, element) {
    const item = element.attributes;
    item.Detail = bool(element.attributes.Detail);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function MemoryFractionsTypeFactory(context, element) {
    const item = element.attributes;
    item.Input = float(element.attributes.Input);
    item.Output = float(element.attributes.Output);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                planNode.metrics.add("Memory Fraction", "Input", item.Input, 0);
                planNode.metrics.add("Memory Fraction", "Output", item.Output, 0);
            }
        }
    });
}
function MemoryGrantTypeFactory(context, element) {
    const item = element.attributes;
    item.SerialRequiredMemory = int(element.attributes.SerialRequiredMemory);
    item.SerialDesiredMemory = int(element.attributes.SerialDesiredMemory);
    item.RequiredMemory = int(element.attributes.RequiredMemory);
    item.DesiredMemory = int(element.attributes.DesiredMemory);
    item.RequestedMemory = int(element.attributes.RequestedMemory);
    item.GrantWaitTime = int(element.attributes.GrantWaitTime);
    item.GrantedMemory = int(element.attributes.GrantedMemory);
    item.MaxUsedMemory = int(element.attributes.MaxUsedMemory);
    item.MaxQueryMemory = int(element.attributes.MaxQueryMemory);
    item.LastRequestedMemory = int(element.attributes.LastRequestedMemory);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                planNode.metrics.add("Memory", "Serial Required Memory", item.SerialRequiredMemory, 0);
                planNode.metrics.add("Memory", "Serial Desired Memory", item.SerialDesiredMemory, 0);
                planNode.metrics.add("Memory", "Required Memory", item.RequiredMemory, 0);
                planNode.metrics.add("Memory", "Desired Memory", item.DesiredMemory, 0);
                planNode.metrics.add("Memory", "Requested Memory", item.RequestedMemory, 0);
                planNode.metrics.add("Memory", "Grant Wait Time", item.GrantWaitTime, 0);
                planNode.metrics.add("Memory", "Granted Memory", item.GrantedMemory, 0);
                planNode.metrics.add("Memory", "Max Used Memory", item.MaxUsedMemory, 0);
                planNode.metrics.add("Memory", "Max Query Memory", item.MaxQueryMemory, 0);
                planNode.metrics.add("Memory", "Last Requested Memory", item.LastRequestedMemory, 0);
                planNode.metrics.add("Memory", "Is Memory Grant Feedback Adjusted", item.IsMemoryGrantFeedbackAdjusted, 0);
            }
        }
    });
}
function MemoryGrantWarningInfoFactory(context, element) {
    const item = element.attributes;
    item.RequestedMemory = int(element.attributes.RequestedMemory);
    item.GrantedMemory = int(element.attributes.GrantedMemory);
    item.MaxUsedMemory = int(element.attributes.MaxUsedMemory);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function TraceFlagTypeFactory(context, element) {
    const item = element.attributes;
    item.Value = int(element.attributes.Value);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function TraceFlagListTypeFactory(context, element) {
    const item = element.attributes;
    item.IsCompileTime = bool(element.attributes.IsCompileTime);
    item.TraceFlag = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "TraceFlag": {
                initializer: TraceFlagTypeFactory,
                setter: (value) => { item.TraceFlag.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function OptimizerHardwareDependentPropertiesTypeFactory(context, element) {
    const item = element.attributes;
    item.EstimatedAvailableMemoryGrant = int(element.attributes.EstimatedAvailableMemoryGrant);
    item.EstimatedPagesCached = int(element.attributes.EstimatedPagesCached);
    item.EstimatedAvailableDegreeOfParallelism = int(element.attributes.EstimatedAvailableDegreeOfParallelism);
    item.MaxCompileMemory = int(element.attributes.MaxCompileMemory);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                planNode.metrics.add("Metrics", `Memory Grant`, item.EstimatedAvailableMemoryGrant);
                planNode.metrics.add("Metrics", `Pages Cached`, item.EstimatedPagesCached);
                planNode.metrics.add("Metrics", `Available Degree Of Parallelism`, item.EstimatedAvailableDegreeOfParallelism);
                planNode.metrics.add("Memory", "Max Compile Memory", item.MaxCompileMemory, 0);
            }
        }
    });
}
function StatsInfoTypeFactory(context, element) {
    const item = element.attributes;
    item.ModificationCount = int(element.attributes.ModificationCount);
    item.SamplingPercent = float(element.attributes.SamplingPercent);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function OptimizerStatsUsageTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "StatisticsInfo": {
                initializer: StatsInfoTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function RunTimeInformationTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "RunTimeCountersPerThread": {
                initializer: RunTimeInformationTypeRunTimeCountersPerThreadFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function RunTimePartitionSummaryTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "PartitionsAccessed": {
                initializer: RunTimePartitionSummaryTypePartitionsAccessedFactory,
                setter: (value) => { item.PartitionsAccessed = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function IndexedViewInfoTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function RollupInfoTypeFactory(context, element) {
    const item = element.attributes;
    item.HighestLevel = int(element.attributes.HighestLevel);
    item.RollupLevel = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RollupLevel": {
                initializer: RollupLevelTypeFactory,
                setter: (value) => { item.RollupLevel.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function RollupLevelTypeFactory(context, element) {
    const item = element.attributes;
    item.Level = int(element.attributes.Level);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function StarJoinInfoTypeFactory(context, element) {
    const item = element.attributes;
    item.Root = bool(element.attributes.Root);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function InternalInfoTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function OptimizationReplayTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function ThreadStatTypeFactory(context, element) {
    const item = element.attributes;
    item.Branches = int(element.attributes.Branches);
    item.UsedThreads = int(element.attributes.UsedThreads);
    item.ThreadReservation = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ThreadReservation": {
                initializer: ThreadReservationTypeFactory,
                setter: (value) => { item.ThreadReservation.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ThreadReservationTypeFactory(context, element) {
    const item = element.attributes;
    item.NodeId = int(element.attributes.NodeId);
    item.ReservedThreads = int(element.attributes.ReservedThreads);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function MissingIndexesTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "MissingIndexGroup": {
                initializer: MissingIndexGroupTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function MissingIndexGroupTypeFactory(context, element) {
    const item = element.attributes;
    item.Impact = float(element.attributes.Impact);
    item.MissingIndex = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "MissingIndex": {
                initializer: MissingIndexTypeFactory,
                setter: (value) => { item.MissingIndex.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function MissingIndexTypeFactory(context, element) {
    const item = element.attributes;
    item.ColumnGroup = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ColumnGroup": {
                initializer: ColumnGroupTypeFactory,
                setter: (value) => { item.ColumnGroup.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ColumnGroupTypeFactory(context, element) {
    const item = element.attributes;
    item.Column = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Column": {
                initializer: ColumnTypeFactory,
                setter: (value) => { item.Column.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ColumnTypeFactory(context, element) {
    const item = element.attributes;
    item.ColumnId = int(element.attributes.ColumnId);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function QueryPlanTypeFactory(context, element) {
    const item = element.attributes;
    item.DegreeOfParallelism = int(element.attributes.DegreeOfParallelism);
    item.EffectiveDegreeOfParallelism = int(element.attributes.EffectiveDegreeOfParallelism);
    item.MemoryGrant = int(element.attributes.MemoryGrant);
    item.CachedPlanSize = int(element.attributes.CachedPlanSize);
    item.CompileTime = int(element.attributes.CompileTime);
    item.CompileCPU = int(element.attributes.CompileCPU);
    item.CompileMemory = int(element.attributes.CompileMemory);
    item.UsePlan = bool(element.attributes.UsePlan);
    item.ContainsInterleavedExecutionCandidates = bool(element.attributes.ContainsInterleavedExecutionCandidates);
    item.ContainsInlineScalarTsqlUdfs = bool(element.attributes.ContainsInlineScalarTsqlUdfs);
    item.QueryVariantID = int(element.attributes.QueryVariantID);
    item.ExclusiveProfileTimeActive = bool(element.attributes.ExclusiveProfileTimeActive);
    item.TraceFlags = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
            "OptimizationReplay": {
                initializer: OptimizationReplayTypeFactory,
                setter: (value) => { item.OptimizationReplay = value; }
            },
            "ThreadStat": {
                initializer: ThreadStatTypeFactory,
                setter: (value) => { item.ThreadStat = value; }
            },
            "MissingIndexes": {
                initializer: MissingIndexesTypeFactory,
                setter: (value) => { item.MissingIndexes = value; }
            },
            "GuessedSelectivity": {
                initializer: GuessedSelectivityTypeFactory,
                setter: (value) => { item.GuessedSelectivity = value; }
            },
            "UnmatchedIndexes": {
                initializer: UnmatchedIndexesTypeFactory,
                setter: (value) => { item.UnmatchedIndexes = value; }
            },
            "Warnings": {
                initializer: WarningsTypeFactory,
                setter: (value) => { item.Warnings = value; }
            },
            "MemoryGrantInfo": {
                initializer: MemoryGrantTypeFactory,
                setter: (value) => { item.MemoryGrantInfo = value; }
            },
            "OptimizerHardwareDependentProperties": {
                initializer: OptimizerHardwareDependentPropertiesTypeFactory,
                setter: (value) => { item.OptimizerHardwareDependentProperties = value; }
            },
            "OptimizerStatsUsage": {
                initializer: OptimizerStatsUsageTypeFactory,
                setter: (value) => { item.OptimizerStatsUsage = value; }
            },
            "TraceFlags": {
                initializer: TraceFlagListTypeFactory,
                setter: (value) => { item.TraceFlags.push(value); }
            },
            "WaitStats": {
                initializer: WaitStatListTypeFactory,
                setter: (value) => { item.WaitStats = value; }
            },
            "QueryTimeStats": {
                initializer: QueryExecTimeTypeFactory,
                setter: (value) => { item.QueryTimeStats = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "ParameterList": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.ParameterList = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                planNode.metrics.add("Common", "Degree Of Parallelism", item.DegreeOfParallelism, 0);
                planNode.metrics.add("Common", "Effective Degree Of Parallelism", item.EffectiveDegreeOfParallelism, 0);
                planNode.metrics.add("Common", "Non Parallel Plan Reason", item.NonParallelPlanReason, 0);
                planNode.metrics.add("Common", "DOPFeedback Adjusted", item.DOPFeedbackAdjusted, 0);
                planNode.metrics.add("Metrics", `Memory Grant`, item.MemoryGrant, 0);
                planNode.metrics.add("Common", "Cached Plan Size", item.CachedPlanSize, 0);
                planNode.metrics.add("Compile", "Compile Time", item.CompileTime, 0);
                planNode.metrics.add("Compile", "Compile CPU", item.CompileCPU, 0);
                planNode.metrics.add("Compile", "Compile Memory", item.CompileMemory, 0);
                planNode.metrics.add("Common", "Use Plan", item.UsePlan, 0);
                planNode.metrics.add("Common", "Contains Interleaved Execution Candidates", item.ContainsInterleavedExecutionCandidates, 0);
                planNode.metrics.add("Common", "Contains Inline Scalar Tsql Udfs", item.ContainsInlineScalarTsqlUdfs, 0);
                planNode.metrics.add("Common", "Query Variant ID", item.QueryVariantID, 0);
                planNode.metrics.add("Common", "Dispatcher Plan Handle", item.DispatcherPlanHandle, 0);
                planNode.metrics.add("Common", "Exclusive Profile Time Active", item.ExclusiveProfileTimeActive, 0);
                binders.ThreadStatTypeBinder(planNode, "true", item.ThreadStat);
                binders.GuessedSelectivityTypeBinder(planNode, "true", item.GuessedSelectivity);
                binders.UnmatchedIndexesTypeBinder(planNode, "true", item.UnmatchedIndexes);
                binders.WarningsTypeBinder(planNode, "statementWarnings", item.Warnings);
                binders.OptimizerStatsUsageTypeBinder(planNode, "true", item.OptimizerStatsUsage);
                binders.TraceFlagListTypeBinder(planNode, "true", item.TraceFlags);
                binders.WaitStatListTypeBinder(planNode, "true", item.WaitStats);
                binders.ColumnReferenceListTypeBinder(planNode, "parameter", item.ParameterList);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                binders.MissingIndexesTypeBinder(context.currentStatement, "true", item.MissingIndexes);
            }
        }
    });
}
function GuessedSelectivityTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Spatial": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Spatial = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "guessed_selectivity_spatial", item.Spatial);
            }
        }
    });
}
function UnmatchedIndexesTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Parameterization": {
                initializer: ParameterizationTypeFactory,
                setter: (value) => { item.Parameterization = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ParameterizationTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function RelOpTypeFactory(context, element) {
    const item = element.attributes;
    item.AvgRowSize = float(element.attributes.AvgRowSize);
    item.EstimateCPU = float(element.attributes.EstimateCPU);
    item.EstimateIO = float(element.attributes.EstimateIO);
    item.EstimateRebinds = float(element.attributes.EstimateRebinds);
    item.EstimateRewinds = float(element.attributes.EstimateRewinds);
    item.GroupExecuted = bool(element.attributes.GroupExecuted);
    item.EstimateRows = float(element.attributes.EstimateRows);
    item.EstimateRowsWithoutRowGoal = float(element.attributes.EstimateRowsWithoutRowGoal);
    item.EstimatedRowsRead = float(element.attributes.EstimatedRowsRead);
    item.LogicalOp = logicalOpType(element.attributes.LogicalOp);
    item.NodeId = int(element.attributes.NodeId);
    item.Parallel = bool(element.attributes.Parallel);
    item.RemoteDataAccess = bool(element.attributes.RemoteDataAccess);
    item.Partitioned = bool(element.attributes.Partitioned);
    item.PhysicalOp = physicalOpType(element.attributes.PhysicalOp);
    item.IsAdaptive = bool(element.attributes.IsAdaptive);
    item.AdaptiveThresholdRows = float(element.attributes.AdaptiveThresholdRows);
    item.EstimatedTotalSubtreeCost = float(element.attributes.EstimatedTotalSubtreeCost);
    item.TableCardinality = float(element.attributes.TableCardinality);
    item.StatsCollectionId = int(element.attributes.StatsCollectionId);
    item.EstimatedJoinType = physicalOpType(element.attributes.EstimatedJoinType);
    item.PDWAccumulativeCost = float(element.attributes.PDWAccumulativeCost);
    context.startElement({
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "AdaptiveJoin": {
                initializer: AdaptiveJoinTypeFactory,
                setter: (value) => { item.AdaptiveJoin = value; }
            },
            "Apply": {
                initializer: JoinTypeFactory,
                setter: (value) => { item.Apply = value; }
            },
            "Assert": {
                initializer: FilterTypeFactory,
                setter: (value) => { item.Assert = value; }
            },
            "BatchHashTableBuild": {
                initializer: BatchHashTableBuildTypeFactory,
                setter: (value) => { item.BatchHashTableBuild = value; }
            },
            "Bitmap": {
                initializer: BitmapTypeFactory,
                setter: (value) => { item.Bitmap = value; }
            },
            "Collapse": {
                initializer: CollapseTypeFactory,
                setter: (value) => { item.Collapse = value; }
            },
            "ComputeScalar": {
                initializer: ComputeScalarTypeFactory,
                setter: (value) => { item.ComputeScalar = value; }
            },
            "Concat": {
                initializer: ConcatTypeFactory,
                setter: (value) => { item.Concat = value; }
            },
            "ConstantScan": {
                initializer: ConstantScanTypeFactory,
                setter: (value) => { item.ConstantScan = value; }
            },
            "ConstTableGet": {
                initializer: GetTypeFactory,
                setter: (value) => { item.ConstTableGet = value; }
            },
            "CreateIndex": {
                initializer: CreateIndexTypeFactory,
                setter: (value) => { item.CreateIndex = value; }
            },
            "Delete": {
                initializer: DMLOpTypeFactory,
                setter: (value) => { item.Delete = value; }
            },
            "DeletedScan": {
                initializer: RowsetTypeFactory,
                setter: (value) => { item.DeletedScan = value; }
            },
            "Extension": {
                initializer: UDXTypeFactory,
                setter: (value) => { item.Extension = value; }
            },
            "ExternalSelect": {
                initializer: ExternalSelectTypeFactory,
                setter: (value) => { item.ExternalSelect = value; }
            },
            "ExtExtractScan": {
                initializer: RemoteTypeFactory,
                setter: (value) => { item.ExtExtractScan = value; }
            },
            "Filter": {
                initializer: FilterTypeFactory,
                setter: (value) => { item.Filter = value; }
            },
            "ForeignKeyReferencesCheck": {
                initializer: ForeignKeyReferencesCheckTypeFactory,
                setter: (value) => { item.ForeignKeyReferencesCheck = value; }
            },
            "GbAgg": {
                initializer: GbAggTypeFactory,
                setter: (value) => { item.GbAgg = value; }
            },
            "GbApply": {
                initializer: GbApplyTypeFactory,
                setter: (value) => { item.GbApply = value; }
            },
            "Generic": {
                initializer: GenericTypeFactory,
                setter: (value) => { item.Generic = value; }
            },
            "Get": {
                initializer: GetTypeFactory,
                setter: (value) => { item.Get = value; }
            },
            "Hash": {
                initializer: HashTypeFactory,
                setter: (value) => { item.Hash = value; }
            },
            "IndexScan": {
                initializer: IndexScanTypeFactory,
                setter: (value) => { item.IndexScan = value; }
            },
            "InsertedScan": {
                initializer: RowsetTypeFactory,
                setter: (value) => { item.InsertedScan = value; }
            },
            "Insert": {
                initializer: DMLOpTypeFactory,
                setter: (value) => { item.Insert = value; }
            },
            "Join": {
                initializer: JoinTypeFactory,
                setter: (value) => { item.Join = value; }
            },
            "LocalCube": {
                initializer: LocalCubeTypeFactory,
                setter: (value) => { item.LocalCube = value; }
            },
            "LogRowScan": {
                initializer: RelOpBaseTypeFactory,
                setter: (value) => { item.LogRowScan = value; }
            },
            "Merge": {
                initializer: MergeTypeFactory,
                setter: (value) => { item.Merge = value; }
            },
            "MergeInterval": {
                initializer: SimpleIteratorOneChildTypeFactory,
                setter: (value) => { item.MergeInterval = value; }
            },
            "Move": {
                initializer: MoveTypeFactory,
                setter: (value) => { item.Move = value; }
            },
            "NestedLoops": {
                initializer: NestedLoopsTypeFactory,
                setter: (value) => { item.NestedLoops = value; }
            },
            "OnlineIndex": {
                initializer: CreateIndexTypeFactory,
                setter: (value) => { item.OnlineIndex = value; }
            },
            "Parallelism": {
                initializer: ParallelismTypeFactory,
                setter: (value) => { item.Parallelism = value; }
            },
            "ParameterTableScan": {
                initializer: RelOpBaseTypeFactory,
                setter: (value) => { item.ParameterTableScan = value; }
            },
            "PrintDataflow": {
                initializer: RelOpBaseTypeFactory,
                setter: (value) => { item.PrintDataflow = value; }
            },
            "Project": {
                initializer: ProjectTypeFactory,
                setter: (value) => { item.Project = value; }
            },
            "Put": {
                initializer: PutTypeFactory,
                setter: (value) => { item.Put = value; }
            },
            "RemoteFetch": {
                initializer: RemoteFetchTypeFactory,
                setter: (value) => { item.RemoteFetch = value; }
            },
            "RemoteModify": {
                initializer: RemoteModifyTypeFactory,
                setter: (value) => { item.RemoteModify = value; }
            },
            "RemoteQuery": {
                initializer: RemoteQueryTypeFactory,
                setter: (value) => { item.RemoteQuery = value; }
            },
            "RemoteRange": {
                initializer: RemoteRangeTypeFactory,
                setter: (value) => { item.RemoteRange = value; }
            },
            "RemoteScan": {
                initializer: RemoteTypeFactory,
                setter: (value) => { item.RemoteScan = value; }
            },
            "RowCountSpool": {
                initializer: SpoolTypeFactory,
                setter: (value) => { item.RowCountSpool = value; }
            },
            "ScalarInsert": {
                initializer: ScalarInsertTypeFactory,
                setter: (value) => { item.ScalarInsert = value; }
            },
            "Segment": {
                initializer: SegmentTypeFactory,
                setter: (value) => { item.Segment = value; }
            },
            "Sequence": {
                initializer: SequenceTypeFactory,
                setter: (value) => { item.Sequence = value; }
            },
            "SequenceProject": {
                initializer: ComputeScalarTypeFactory,
                setter: (value) => { item.SequenceProject = value; }
            },
            "SimpleUpdate": {
                initializer: SimpleUpdateTypeFactory,
                setter: (value) => { item.SimpleUpdate = value; }
            },
            "Sort": {
                initializer: SortTypeFactory,
                setter: (value) => { item.Sort = value; }
            },
            "Split": {
                initializer: SplitTypeFactory,
                setter: (value) => { item.Split = value; }
            },
            "Spool": {
                initializer: SpoolTypeFactory,
                setter: (value) => { item.Spool = value; }
            },
            "StreamAggregate": {
                initializer: StreamAggregateTypeFactory,
                setter: (value) => { item.StreamAggregate = value; }
            },
            "Switch": {
                initializer: SwitchTypeFactory,
                setter: (value) => { item.Switch = value; }
            },
            "TableScan": {
                initializer: TableScanTypeFactory,
                setter: (value) => { item.TableScan = value; }
            },
            "TableValuedFunction": {
                initializer: TableValuedFunctionTypeFactory,
                setter: (value) => { item.TableValuedFunction = value; }
            },
            "Top": {
                initializer: TopTypeFactory,
                setter: (value) => { item.Top = value; }
            },
            "TopSort": {
                initializer: TopSortTypeFactory,
                setter: (value) => { item.TopSort = value; }
            },
            "Update": {
                initializer: UpdateTypeFactory,
                setter: (value) => { item.Update = value; }
            },
            "Update": {
                initializer: UpdateTypeFactory,
                setter: (value) => { item.Update = value; }
            },
            "Union": {
                initializer: ConcatTypeFactory,
                setter: (value) => { item.Union = value; }
            },
            "UnionAll": {
                initializer: ConcatTypeFactory,
                setter: (value) => { item.UnionAll = value; }
            },
            "WindowSpool": {
                initializer: WindowTypeFactory,
                setter: (value) => { item.WindowSpool = value; }
            },
            "WindowAggregate": {
                initializer: WindowAggregateTypeFactory,
                setter: (value) => { item.WindowAggregate = value; }
            },
            "XcsScan": {
                initializer: XcsScanTypeFactory,
                setter: (value) => { item.XcsScan = value; }
            },
            "OutputList": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.OutputList = value; }
            },
            "Warnings": {
                initializer: WarningsTypeFactory,
                setter: (value) => { item.Warnings = value; }
            },
            "MemoryFractions": {
                initializer: MemoryFractionsTypeFactory,
                setter: (value) => { item.MemoryFractions = value; }
            },
            "RunTimeInformation": {
                initializer: RunTimeInformationTypeFactory,
                setter: (value) => { item.RunTimeInformation = value; }
            },
            "RunTimePartitionSummary": {
                initializer: RunTimePartitionSummaryTypeFactory,
                setter: (value) => { item.RunTimePartitionSummary = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.PhysicalOp, item.LogicalOp);
                if (item.GroupExecuted) {
                    planNode.flags.push("Group Executed");
                }
                if (item.Parallel) {
                    planNode.flags.push("Parallel");
                }
                if (item.RemoteDataAccess) {
                    planNode.flags.push("Remote Data Access");
                }
                if (item.Partitioned) {
                    planNode.flags.push("Partitioned");
                }
                if (item.IsAdaptive) {
                    planNode.flags.push("Is Adaptive");
                }
                planNode.metrics.add("Metrics", `Average Row Size`, item.AvgRowSize, 0);
                planNode.metrics.add("Metrics", `CPU`, item.EstimateCPU);
                planNode.metrics.add("Metrics", `IO`, item.EstimateIO);
                planNode.metrics.add("Metrics", `Rebinds`, item.EstimateRebinds);
                planNode.metrics.add("Metrics", `Rewinds`, item.EstimateRewinds);
                planNode.metrics.add("Metrics", `Execution Mode`, item.EstimatedExecutionMode);
                planNode.metrics.add("Metrics", `Rows`, item.EstimateRows);
                planNode.metrics.add("Metrics", `Rows`, item.EstimateRowsWithoutRowGoal);
                planNode.metrics.add("Metrics", `Rows Read`, item.EstimatedRowsRead);
                planNode.metrics.add("General", `Logical Operation`, item.LogicalOp, 0);
                planNode.metrics.add("General", "Node Id", item.NodeId, 0);
                planNode.metrics.add("General", `Physical Operation`, item.PhysicalOp, 0);
                planNode.metrics.add("General", "Adaptive Threshold Rows", item.AdaptiveThresholdRows, 0);
                planNode.metrics.add("Metrics", `Total Subtree Cost`, item.EstimatedTotalSubtreeCost);
                planNode.metrics.add("Metrics", "Table Cardinality", item.TableCardinality, 0);
                planNode.metrics.add("General", "Stats Collection Id", item.StatsCollectionId, 0);
                planNode.metrics.add("Metrics", `Join Type`, item.EstimatedJoinType);
                planNode.metrics.add("Metrics", `Hyper Scale Optimized Query Processing`, item.HyperScaleOptimizedQueryProcessing);
                planNode.metrics.add("Metrics", `Hyper Scale Optimized Query Processing Unused Reason`, item.HyperScaleOptimizedQueryProcessingUnusedReason);
                planNode.metrics.add("Metrics", `PDW Accumulative Cost`, item.PDWAccumulativeCost);
                binders.FilterTypeBinder(planNode, "nameset", item.Assert);
                binders.ConstantScanTypeBinder(planNode, "const", item.ConstantScan);
                binders.FilterTypeBinder(planNode, "nameset", item.Filter);
                binders.ParallelismTypeBinder(planNode, "parallelism", item.Parallelism);
                binders.ProjectTypeBinder(planNode, "remote", item.Project);
                binders.PutTypeBinder(planNode, "remote", item.Put);
                binders.RemoteFetchTypeBinder(planNode, "remote", item.RemoteFetch);
                binders.RemoteModifyTypeBinder(planNode, "remote", item.RemoteModify);
                binders.RemoteQueryTypeBinder(planNode, "remote", item.RemoteQuery);
                binders.RemoteRangeTypeBinder(planNode, "remote", item.RemoteRange);
                binders.RemoteTypeBinder(planNode, "remote", item.RemoteScan);
                binders.SegmentTypeBinder(planNode, "segment", item.Segment);
                binders.SortTypeBinder(planNode, "nameset", item.Sort);
                binders.SplitTypeBinder(planNode, "split", item.Split);
                binders.StreamAggregateTypeBinder(planNode, "nameset", item.StreamAggregate);
                binders.TableScanTypeBinder(planNode, "nameset", item.TableScan);
                binders.TableValuedFunctionTypeBinder(planNode, "nameset", item.TableValuedFunction);
                binders.TopTypeBinder(planNode, "nameset", item.Top);
                binders.TopSortTypeBinder(planNode, "nameset", item.TopSort);
                binders.ColumnReferenceListTypeBinder(planNode, "output", item.OutputList);
                binders.WarningsTypeBinder(planNode, "nodeWarnings", item.Warnings);
                binders.RunTimeInformationTypeBinder(planNode, "true", item.RunTimeInformation);
                binders.RunTimePartitionSummaryTypeBinder(planNode, "partition", item.RunTimePartitionSummary);
            }
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.setEstimateCPU(item.EstimateCPU);
                statement.setEstimateIO(item.EstimateIO);
            }
        }
    });
}
function AdaptiveJoinTypeFactory(context, element) {
    const item = element.attributes;
    item.BitmapCreator = bool(element.attributes.BitmapCreator);
    item.Optimized = bool(element.attributes.Optimized);
    item.WithOrderedPrefetch = bool(element.attributes.WithOrderedPrefetch);
    item.WithUnorderedPrefetch = bool(element.attributes.WithUnorderedPrefetch);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "HashKeysBuild": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.HashKeysBuild = value; }
            },
            "HashKeysProbe": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.HashKeysProbe = value; }
            },
            "BuildResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.BuildResidual = value; }
            },
            "ProbeResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.ProbeResidual = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value) => { item.StarJoinInfo = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "PassThru": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.PassThru = value; }
            },
            "OuterReferences": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.OuterReferences = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.BitmapCreator) {
                    planNode.flags.push("Bitmap Creator");
                }
                if (item.Optimized) {
                    planNode.flags.push("Optimized");
                }
                if (item.WithOrderedPrefetch) {
                    planNode.flags.push("With Ordered Prefetch");
                }
                if (item.WithUnorderedPrefetch) {
                    planNode.flags.push("With Unordered Prefetch");
                }
                binders.ColumnReferenceListTypeBinder(planNode, "build_hash", item.HashKeysBuild);
                binders.ColumnReferenceListTypeBinder(planNode, "probe_hash", item.HashKeysProbe);
                binders.ScalarExpressionTypeBinder(planNode, "build_hash", item.BuildResidual);
                binders.ScalarExpressionTypeBinder(planNode, "probe_hash", item.ProbeResidual);
                binders.StarJoinInfoTypeBinder(planNode, "starjoin", item.StarJoinInfo);
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.ScalarExpressionTypeBinder(planNode, "passthru", item.PassThru);
                binders.ColumnReferenceListTypeBinder(planNode, "outer_references", item.OuterReferences);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ForeignKeyReferencesCheckTypeFactory(context, element) {
    const item = element.attributes;
    item.ForeignKeyReferencesCount = int(element.attributes.ForeignKeyReferencesCount);
    item.NoMatchingIndexCount = int(element.attributes.NoMatchingIndexCount);
    item.PartialMatchingIndexCount = int(element.attributes.PartialMatchingIndexCount);
    item.ForeignKeyReferenceCheck = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "ForeignKeyReferenceCheck": {
                initializer: ForeignKeyReferenceCheckTypeFactory,
                setter: (value) => { item.ForeignKeyReferenceCheck.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.ForeignKeyReferencesCount) {
                    planNode.flags.push(`Foreign Key Count: ${item.ForeignKeyReferencesCount}`);
                }
                if (item.NoMatchingIndexCount) {
                    planNode.flags.push(`No Matching Count: ${item.NoMatchingIndexCount}`);
                }
                if (item.PartialMatchingIndexCount) {
                    planNode.flags.push(`Partial Count: ${item.PartialMatchingIndexCount}`);
                }
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ForeignKeyReferenceCheckTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "IndexScan": {
                initializer: IndexScanTypeFactory,
                setter: (value) => { item.IndexScan = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SimpleIteratorOneChildTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function FilterTypeFactory(context, element) {
    const item = element.attributes;
    item.StartupExpression = bool(element.attributes.StartupExpression);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.StartupExpression) {
                    planNode.flags.push("Startup Expression");
                }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ConstantScanTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Values": {
                initializer: ConstantScanTypeValuesFactory,
                setter: (value) => { item.Values = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function TableScanTypeFactory(context, element) {
    const item = element.attributes;
    item.Ordered = bool(element.attributes.Ordered);
    item.ForcedIndex = bool(element.attributes.ForcedIndex);
    item.ForceScan = bool(element.attributes.ForceScan);
    item.NoExpandHint = bool(element.attributes.NoExpandHint);
    item.Storage = storageType(element.attributes.Storage);
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "IndexedViewInfo": {
                initializer: IndexedViewInfoTypeFactory,
                setter: (value) => { item.IndexedViewInfo = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Ordered) {
                    planNode.flags.push("Ordered");
                }
                if (item.ForcedIndex) {
                    planNode.flags.push("Forced Index");
                }
                if (item.ForceScan) {
                    planNode.flags.push("Force Scan");
                }
                if (item.NoExpandHint) {
                    planNode.flags.push("No Expand Hint");
                }
                if (item.Storage) {
                    planNode.flags.push("Storage");
                }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function XcsScanTypeFactory(context, element) {
    const item = element.attributes;
    item.Ordered = bool(element.attributes.Ordered);
    item.ForcedIndex = bool(element.attributes.ForcedIndex);
    item.ForceScan = bool(element.attributes.ForceScan);
    item.NoExpandHint = bool(element.attributes.NoExpandHint);
    item.Storage = storageType(element.attributes.Storage);
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "IndexedViewInfo": {
                initializer: IndexedViewInfoTypeFactory,
                setter: (value) => { item.IndexedViewInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Ordered) {
                    planNode.flags.push("Ordered");
                }
                if (item.ForcedIndex) {
                    planNode.flags.push("Forced Index");
                }
                if (item.ForceScan) {
                    planNode.flags.push("Force Scan");
                }
                if (item.NoExpandHint) {
                    planNode.flags.push("No Expand Hint");
                }
                if (item.Storage) {
                    planNode.flags.push("Storage");
                }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function IndexScanTypeFactory(context, element) {
    const item = element.attributes;
    item.Lookup = bool(element.attributes.Lookup);
    item.Ordered = bool(element.attributes.Ordered);
    item.ForcedIndex = bool(element.attributes.ForcedIndex);
    item.ForceSeek = bool(element.attributes.ForceSeek);
    item.ForceSeekColumnCount = int(element.attributes.ForceSeekColumnCount);
    item.ForceScan = bool(element.attributes.ForceScan);
    item.NoExpandHint = bool(element.attributes.NoExpandHint);
    item.Storage = storageType(element.attributes.Storage);
    item.DynamicSeek = bool(element.attributes.DynamicSeek);
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SeekPredicates": {
                initializer: SeekPredicatesTypeFactory,
                setter: (value) => { item.SeekPredicates = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "IndexedViewInfo": {
                initializer: IndexedViewInfoTypeFactory,
                setter: (value) => { item.IndexedViewInfo = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Lookup) {
                    planNode.flags.push("Lookup");
                }
                if (item.Ordered) {
                    planNode.flags.push("Ordered");
                }
                if (item.ScanDirection) {
                    planNode.flags.push(`${item.ScanDirection}`);
                }
                if (item.ForcedIndex) {
                    planNode.flags.push("Forced Index");
                }
                if (item.ForceSeek) {
                    planNode.flags.push(`Force Seek (${item.ForceSeekColumnCount} columns)`);
                }
                if (item.ForceScan) {
                    planNode.flags.push("Force Scan");
                }
                if (item.NoExpandHint) {
                    planNode.flags.push("No Expand Hint");
                }
                if (item.Storage) {
                    planNode.flags.push(`${item.Storage}`);
                }
                if (item.DynamicSeek) {
                    planNode.flags.push(`${item.DynamicSeek}`);
                }
                if (item.SBSFileUrl) {
                    planNode.flags.push("SBSFile Url");
                }
                binders.SeekPredicatesTypeBinder(planNode, "seek_predicate", item.SeekPredicates);
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function TableValuedFunctionTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "ParameterList": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value) => { item.ParameterList = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "tablevaluefunction", item.Object);
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function HashTypeFactory(context, element) {
    const item = element.attributes;
    item.BitmapCreator = bool(element.attributes.BitmapCreator);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "HashKeysBuild": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.HashKeysBuild = value; }
            },
            "HashKeysProbe": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.HashKeysProbe = value; }
            },
            "BuildResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.BuildResidual = value; }
            },
            "ProbeResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.ProbeResidual = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value) => { item.StarJoinInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.BitmapCreator) {
                    planNode.flags.push("Bitmap Creator");
                }
                binders.ColumnReferenceListTypeBinder(planNode, "build_hash", item.HashKeysBuild);
                binders.ColumnReferenceListTypeBinder(planNode, "probe_hash", item.HashKeysProbe);
                binders.ScalarExpressionTypeBinder(planNode, "build_hash", item.BuildResidual);
                binders.ScalarExpressionTypeBinder(planNode, "probe_hash", item.ProbeResidual);
                binders.StarJoinInfoTypeBinder(planNode, "starjoin", item.StarJoinInfo);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ComputeScalarTypeFactory(context, element) {
    const item = element.attributes;
    item.ComputeSequence = bool(element.attributes.ComputeSequence);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.ComputeSequence) {
                    planNode.flags.push("Compute Sequence");
                }
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ParallelismTypeFactory(context, element) {
    const item = element.attributes;
    item.PartitioningType = partitionType(element.attributes.PartitioningType);
    item.Remoting = bool(element.attributes.Remoting);
    item.LocalParallelism = bool(element.attributes.LocalParallelism);
    item.InRow = bool(element.attributes.InRow);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "PartitionColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.PartitionColumns = value; }
            },
            "OrderBy": {
                initializer: OrderByTypeFactory,
                setter: (value) => { item.OrderBy = value; }
            },
            "HashKeys": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.HashKeys = value; }
            },
            "ProbeColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.ProbeColumn = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "Activation": {
                initializer: ParallelismTypeActivationFactory,
                setter: (value) => { item.Activation = value; }
            },
            "BrickRouting": {
                initializer: ParallelismTypeBrickRoutingFactory,
                setter: (value) => { item.BrickRouting = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.PartitioningType) {
                    planNode.flags.push(`${item.PartitioningType}`);
                }
                if (item.Remoting) {
                    planNode.flags.push("Remoting");
                }
                if (item.LocalParallelism) {
                    planNode.flags.push("Local Parallelism");
                }
                if (item.InRow) {
                    planNode.flags.push("In Row");
                }
                binders.ColumnReferenceListTypeBinder(planNode, "partition", item.PartitionColumns);
                binders.OrderByTypeBinder(planNode, "orderby", item.OrderBy);
                binders.ColumnReferenceListTypeBinder(planNode, "hashkeys", item.HashKeys);
                binders.SingleColumnReferenceTypeBinder(planNode, "probe", item.ProbeColumn);
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function StreamAggregateTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.GroupBy = value; }
            },
            "RollupInfo": {
                initializer: RollupInfoTypeFactory,
                setter: (value) => { item.RollupInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ColumnReferenceListTypeBinder(planNode, "groupby", item.GroupBy);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function BitmapTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "HashKeys": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.HashKeys = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ColumnReferenceListTypeBinder(planNode, "hashkeys", item.HashKeys);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function CollapseTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.GroupBy = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ColumnReferenceListTypeBinder(planNode, "groupby", item.GroupBy);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SwitchTypeFactory(context, element) {
    const item = element.attributes;
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function MergeTypeFactory(context, element) {
    const item = element.attributes;
    item.ManyToMany = bool(element.attributes.ManyToMany);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "InnerSideJoinColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.InnerSideJoinColumns = value; }
            },
            "OuterSideJoinColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.OuterSideJoinColumns = value; }
            },
            "Residual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Residual = value; }
            },
            "PassThru": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.PassThru = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value) => { item.StarJoinInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.ManyToMany) {
                    planNode.flags.push("Many To Many");
                }
                binders.ColumnReferenceListTypeBinder(planNode, "join_inside", item.InnerSideJoinColumns);
                binders.ColumnReferenceListTypeBinder(planNode, "join_outside", item.OuterSideJoinColumns);
                binders.ScalarExpressionTypeBinder(planNode, "residual", item.Residual);
                binders.ScalarExpressionTypeBinder(planNode, "passthru", item.PassThru);
                binders.StarJoinInfoTypeBinder(planNode, "starjoin", item.StarJoinInfo);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function NestedLoopsTypeFactory(context, element) {
    const item = element.attributes;
    item.Optimized = bool(element.attributes.Optimized);
    item.WithOrderedPrefetch = bool(element.attributes.WithOrderedPrefetch);
    item.WithUnorderedPrefetch = bool(element.attributes.WithUnorderedPrefetch);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
            "PassThru": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.PassThru = value; }
            },
            "OuterReferences": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.OuterReferences = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "ProbeColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.ProbeColumn = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value) => { item.StarJoinInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Optimized) {
                    planNode.flags.push("Optimized");
                }
                if (item.WithOrderedPrefetch) {
                    planNode.flags.push("With Ordered Prefetch");
                }
                if (item.WithUnorderedPrefetch) {
                    planNode.flags.push("With Unordered Prefetch");
                }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.ScalarExpressionTypeBinder(planNode, "passthru", item.PassThru);
                binders.ColumnReferenceListTypeBinder(planNode, "outer_references", item.OuterReferences);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.SingleColumnReferenceTypeBinder(planNode, "probe", item.ProbeColumn);
                binders.StarJoinInfoTypeBinder(planNode, "starjoin", item.StarJoinInfo);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SegmentTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.GroupBy = value; }
            },
            "SegmentColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.SegmentColumn = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ColumnReferenceListTypeBinder(planNode, "groupby", item.GroupBy);
                binders.SingleColumnReferenceTypeBinder(planNode, "segment", item.SegmentColumn);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SequenceTypeFactory(context, element) {
    const item = element.attributes;
    item.IsGraphDBTransitiveClosure = bool(element.attributes.IsGraphDBTransitiveClosure);
    item.GraphSequenceIdentifier = int(element.attributes.GraphSequenceIdentifier);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SplitTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ActionColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.ActionColumn = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.SingleColumnReferenceTypeBinder(planNode, "action", item.ActionColumn);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function TopTypeFactory(context, element) {
    const item = element.attributes;
    item.RowCount = bool(element.attributes.RowCount);
    item.Rows = int(element.attributes.Rows);
    item.IsPercent = bool(element.attributes.IsPercent);
    item.WithTies = bool(element.attributes.WithTies);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "TieColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.TieColumns = value; }
            },
            "OffsetExpression": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.OffsetExpression = value; }
            },
            "TopExpression": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.TopExpression = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ColumnReferenceListTypeBinder(planNode, "tie", item.TieColumns);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function UDXTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "UsedUDXColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.UsedUDXColumns = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.UDXName) {
                    planNode.nameSet.push(item.UDXName);
                }
                binders.ColumnReferenceListTypeBinder(planNode, "udx", item.UsedUDXColumns);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function WindowTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function WindowAggregateTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function PutTypeFactory(context, element) {
    const item = element.attributes;
    item.IsExternallyComputed = bool(element.attributes.IsExternallyComputed);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SimpleUpdateTypeFactory(context, element) {
    const item = element.attributes;
    item.DMLRequestSort = bool(element.attributes.DMLRequestSort);
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SeekPredicate": {
                initializer: SeekPredicateTypeFactory,
                setter: (value) => { item.SeekPredicate = value; }
            },
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value) => { item.SeekPredicateNew = value; }
            },
            "SetPredicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.SetPredicate = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.DMLRequestSort) {
                    planNode.flags.push("DMLRequest Sort");
                }
                binders.SeekPredicateTypeBinder(planNode, "seek_predicate", item.SeekPredicate);
                binders.SeekPredicateNewTypeBinder(planNode, "seek_predicate", item.SeekPredicateNew);
                binders.ScalarExpressionTypeBinder(planNode, "set_predicate", item.SetPredicate);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SetPredicateElementTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function UpdateTypeFactory(context, element) {
    const item = element.attributes;
    item.WithOrderedPrefetch = bool(element.attributes.WithOrderedPrefetch);
    item.WithUnorderedPrefetch = bool(element.attributes.WithUnorderedPrefetch);
    item.DMLRequestSort = bool(element.attributes.DMLRequestSort);
    item.SetPredicate = [];
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SetPredicate": {
                initializer: SetPredicateElementTypeFactory,
                setter: (value) => { item.SetPredicate.push(value); }
            },
            "ProbeColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.ProbeColumn = value; }
            },
            "ActionColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.ActionColumn = value; }
            },
            "OriginalActionColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.OriginalActionColumn = value; }
            },
            "AssignmentMap": {
                initializer: AssignmentMapTypeFactory,
                setter: (value) => { item.AssignmentMap = value; }
            },
            "SourceTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value) => { item.SourceTable = value; }
            },
            "TargetTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value) => { item.TargetTable = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.SetPredicateElementTypeBinder(planNode, "set_predicate", item.SetPredicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "probe", item.ProbeColumn);
                binders.SingleColumnReferenceTypeBinder(planNode, "action", item.ActionColumn);
                binders.SingleColumnReferenceTypeBinder(planNode, "original_action", item.OriginalActionColumn);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function CreateIndexTypeFactory(context, element) {
    const item = element.attributes;
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SpoolTypeFactory(context, element) {
    const item = element.attributes;
    item.Stack = bool(element.attributes.Stack);
    item.PrimaryNodeId = int(element.attributes.PrimaryNodeId);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SeekPredicate": {
                initializer: SeekPredicateTypeFactory,
                setter: (value) => { item.SeekPredicate = value; }
            },
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value) => { item.SeekPredicateNew = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Stack) {
                    planNode.flags.push("Stack");
                }
                if (item.PrimaryNodeId) {
                    planNode.flags.push(`Primary Node ID: ${item.PrimaryNodeId}`);
                }
                binders.SeekPredicateTypeBinder(planNode, "seek_predicate", item.SeekPredicate);
                binders.SeekPredicateNewTypeBinder(planNode, "seek_predicate", item.SeekPredicateNew);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function BatchHashTableBuildTypeFactory(context, element) {
    const item = element.attributes;
    item.BitmapCreator = bool(element.attributes.BitmapCreator);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.BitmapCreator) {
                    planNode.flags.push("Bitmap Creator");
                }
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ScalarInsertTypeFactory(context, element) {
    const item = element.attributes;
    item.DMLRequestSort = bool(element.attributes.DMLRequestSort);
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SetPredicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.SetPredicate = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.DMLRequestSort) {
                    planNode.flags.push("DMLRequest Sort");
                }
                binders.ScalarExpressionTypeBinder(planNode, "set_predicate", item.SetPredicate);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function TopSortTypeFactory(context, element) {
    const item = element.attributes;
    item.Rows = int(element.attributes.Rows);
    item.WithTies = bool(element.attributes.WithTies);
    item.Distinct = bool(element.attributes.Distinct);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "OrderBy": {
                initializer: OrderByTypeFactory,
                setter: (value) => { item.OrderBy = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.PartitionId = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Distinct) {
                    planNode.flags.push("Distinct");
                }
                binders.OrderByTypeBinder(planNode, "orderby", item.OrderBy);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RemoteRangeTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SeekPredicates": {
                initializer: SeekPredicatesTypeFactory,
                setter: (value) => { item.SeekPredicates = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.SeekPredicatesTypeBinder(planNode, "seek_predicate", item.SeekPredicates);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RemoteFetchTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RemoteModifyTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "SetPredicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.SetPredicate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ScalarExpressionTypeBinder(planNode, "set_predicate", item.SetPredicate);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function GenericTypeFactory(context, element) {
    const item = element.attributes;
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ResourceEstimateTypeFactory(context, element) {
    const item = element.attributes;
    item.NodeCount = int(element.attributes.NodeCount);
    item.Dop = float(element.attributes.Dop);
    item.MemoryInBytes = float(element.attributes.MemoryInBytes);
    item.DiskWrittenInBytes = float(element.attributes.DiskWrittenInBytes);
    item.Scalable = bool(element.attributes.Scalable);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function MoveTypeFactory(context, element) {
    const item = element.attributes;
    item.IsDistributed = bool(element.attributes.IsDistributed);
    item.IsExternal = bool(element.attributes.IsExternal);
    item.IsFull = bool(element.attributes.IsFull);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "DistributionKey": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.DistributionKey = value; }
            },
            "ResourceEstimate": {
                initializer: ResourceEstimateTypeFactory,
                setter: (value) => { item.ResourceEstimate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ExternalSelectTypeFactory(context, element) {
    const item = element.attributes;
    item.IsDistributed = bool(element.attributes.IsDistributed);
    item.IsExternal = bool(element.attributes.IsExternal);
    item.IsFull = bool(element.attributes.IsFull);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ProjectTypeFactory(context, element) {
    const item = element.attributes;
    item.IsNoOp = bool(element.attributes.IsNoOp);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function JoinTypeFactory(context, element) {
    const item = element.attributes;
    item.Predicate = [];
    item.Probe = [];
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate.push(value); }
            },
            "Probe": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.Probe.push(value); }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function GbApplyTypeFactory(context, element) {
    const item = element.attributes;
    item.Predicate = [];
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate.push(value); }
            },
            "AggFunctions": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.AggFunctions = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function GbAggTypeFactory(context, element) {
    const item = element.attributes;
    item.IsScalar = bool(element.attributes.IsScalar);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.GroupBy = value; }
            },
            "AggFunctions": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.AggFunctions = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function GroupingSetReferenceTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function GroupingSetListTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "GroupingSet": {
                initializer: GroupingSetReferenceTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function LocalCubeTypeFactory(context, element) {
    const item = element.attributes;
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.GroupBy = value; }
            },
            "GroupingSets": {
                initializer: GroupingSetListTypeFactory,
                setter: (value) => { item.GroupingSets = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function DMLOpTypeFactory(context, element) {
    const item = element.attributes;
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "AssignmentMap": {
                initializer: AssignmentMapTypeFactory,
                setter: (value) => { item.AssignmentMap = value; }
            },
            "SourceTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value) => { item.SourceTable = value; }
            },
            "TargetTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value) => { item.TargetTable = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function AssignmentMapTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Assign": {
                initializer: AssignTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function GetTypeFactory(context, element) {
    const item = element.attributes;
    item.NumRows = int(element.attributes.NumRows);
    item.IsExternal = bool(element.attributes.IsExternal);
    item.IsDistributed = bool(element.attributes.IsDistributed);
    item.IsHashDistributed = bool(element.attributes.IsHashDistributed);
    item.IsReplicated = bool(element.attributes.IsReplicated);
    item.IsRoundRobin = bool(element.attributes.IsRoundRobin);
    item.RelOp = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Bookmarks": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value) => { item.Bookmarks = value; }
            },
            "OutputColumns": {
                initializer: OutputColumnsTypeFactory,
                setter: (value) => { item.OutputColumns = value; }
            },
            "GeneratedData": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value) => { item.GeneratedData = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp.push(value); }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function OutputColumnsTypeFactory(context, element) {
    const item = element.attributes;
    item.Object = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value) => { item.DefinedValues = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ScalarTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Aggregate": {
                initializer: AggregateTypeFactory,
                setter: (value) => { item.Aggregate = value; }
            },
            "Arithmetic": {
                initializer: ArithmeticTypeFactory,
                setter: (value) => { item.Arithmetic = value; }
            },
            "Assign": {
                initializer: AssignTypeFactory,
                setter: (value) => { item.Assign = value; }
            },
            "Compare": {
                initializer: CompareTypeFactory,
                setter: (value) => { item.Compare = value; }
            },
            "Const": {
                initializer: ConstTypeFactory,
                setter: (value) => { item.Const = value; }
            },
            "Convert": {
                initializer: ConvertTypeFactory,
                setter: (value) => { item.Convert = value; }
            },
            "Identifier": {
                initializer: IdentTypeFactory,
                setter: (value) => { item.Identifier = value; }
            },
            "IF": {
                initializer: ConditionalTypeFactory,
                setter: (value) => { item.IF = value; }
            },
            "Intrinsic": {
                initializer: IntrinsicTypeFactory,
                setter: (value) => { item.Intrinsic = value; }
            },
            "Logical": {
                initializer: LogicalTypeFactory,
                setter: (value) => { item.Logical = value; }
            },
            "MultipleAssign": {
                initializer: MultAssignTypeFactory,
                setter: (value) => { item.MultipleAssign = value; }
            },
            "ScalarExpressionList": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value) => { item.ScalarExpressionList = value; }
            },
            "Sequence": {
                initializer: ScalarSequenceTypeFactory,
                setter: (value) => { item.Sequence = value; }
            },
            "Subquery": {
                initializer: SubqueryTypeFactory,
                setter: (value) => { item.Subquery = value; }
            },
            "UDTMethod": {
                initializer: UDTMethodTypeFactory,
                setter: (value) => { item.UDTMethod = value; }
            },
            "UserDefinedAggregate": {
                initializer: UDAggregateTypeFactory,
                setter: (value) => { item.UserDefinedAggregate = value; }
            },
            "UserDefinedFunction": {
                initializer: UDFTypeFactory,
                setter: (value) => { item.UserDefinedFunction = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value) => { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ScalarExpressionListTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function ConstTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function IdentTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.ColumnReference = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function CompareTypeFactory(context, element) {
    const item = element.attributes;
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ConvertTypeFactory(context, element) {
    const item = element.attributes;
    item.Length = int(element.attributes.Length);
    item.Precision = int(element.attributes.Precision);
    item.Scale = int(element.attributes.Scale);
    item.StyleIndex = int(element.attributes.Style);
    item.Implicit = bool(element.attributes.Implicit);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Style": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Style = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ArithmeticTypeFactory(context, element) {
    const item = element.attributes;
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function LogicalTypeFactory(context, element) {
    const item = element.attributes;
    item.Operation = logicalOperationType(element.attributes.Operation);
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function UDAggregateTypeFactory(context, element) {
    const item = element.attributes;
    item.Distinct = bool(element.attributes.Distinct);
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "UDAggObject": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.UDAggObject = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "ud_aggregate", item.UDAggObject);
            }
        }
    });
}
function AggregateTypeFactory(context, element) {
    const item = element.attributes;
    item.Distinct = bool(element.attributes.Distinct);
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function AssignTypeFactory(context, element) {
    const item = element.attributes;
    item.SourceColumn = [];
    item.TargetColumn = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.ColumnReference = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
            "SourceColumn": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.SourceColumn.push(value); }
            },
            "TargetColumn": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.TargetColumn.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function MultAssignTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Assign": {
                initializer: AssignTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function ConditionalTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Condition": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Condition = value; }
            },
            "Then": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Then = value; }
            },
            "Else": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Else = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function IntrinsicTypeFactory(context, element) {
    const item = element.attributes;
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ScalarSequenceTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function UDFTypeFactory(context, element) {
    const item = element.attributes;
    item.IsClrFunction = bool(element.attributes.IsClrFunction);
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
            "CLRFunction": {
                initializer: CLRFunctionTypeFactory,
                setter: (value) => { item.CLRFunction = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function UDTMethodTypeFactory(context, element) {
    const item = element.attributes;
    item.ScalarOperator = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "CLRFunction": {
                initializer: CLRFunctionTypeFactory,
                setter: (value) => { item.CLRFunction = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function CLRFunctionTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function SubqueryTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value) => { item.RelOp = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function DispatcherTypeFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "ParameterSensitivePredicate": {
                initializer: ParameterSensitivePredicateTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function ParameterSensitivePredicateTypeFactory(context, element) {
    const item = element.attributes;
    item.LowBoundary = float(element.attributes.LowBoundary);
    item.HighBoundary = float(element.attributes.HighBoundary);
    item.StatisticsInfo = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "StatisticsInfo": {
                initializer: StatsInfoTypeFactory,
                setter: (value) => { item.StatisticsInfo.push(value); }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value) => { item.Predicate = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SetOptionsTypeFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
            if (context.currentStatement) {
                const statement = context.currentStatement;
                statement.ansi.push('ANSI NULLS ' + item.ANSI_NULLS);
                statement.ansi.push('ANSI PADDING ' + item.ANSI_PADDING);
                statement.ansi.push('ANSI WARNINGS ' + item.ANSI_WARNINGS);
                statement.ansi.push('ANSI ARITHABORT ' + item.ARITHABORT);
                statement.ansi.push('CONCAT NULL YIELDS NULL ' + item.CONCAT_NULL_YIELDS_NULL);
                statement.ansi.push('NUMERIC ROUNDABORT ' + item.NUMERIC_ROUNDABORT);
                statement.ansi.push('QUOTED IDENTIFIER ' + item.QUOTED_IDENTIFIER);
            }
        }
    });
}
function BatchSequenceFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Batch": {
                initializer: BatchFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function BatchFactory(context, element) {
    const items = [];
    context.startElement({
        isBatch: true,
        item: items,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function StmtCondTypeConditionFactory(context, element) {
    const item = element.attributes;
    item.UDF = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value) => { item.QueryPlan = value; }
            },
            "UDF": {
                initializer: FunctionTypeFactory,
                setter: (value) => { item.UDF.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtCondTypeThenFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value) => { item.Statements = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtCondTypeElseFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value) => { item.Statements = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function CursorPlanTypeOperationFactory(context, element) {
    const item = element.attributes;
    item.OperationType = cursorPlanTypeOperationOperationTypeEnum(element.attributes.OperationType);
    item.UDF = [];
    context.startElement({
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Dispatcher": {
                initializer: DispatcherTypeFactory,
                setter: (value) => { item.Dispatcher = value; }
            },
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value) => { item.QueryPlan = value; }
            },
            "UDF": {
                initializer: FunctionTypeFactory,
                setter: (value) => { item.UDF.push(value); }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, item.OperationType);
                planNode.metrics.add("General", "Operation Type", item.OperationType, 0);
            }
        }
    });
}
function ReceivePlanTypeOperationFactory(context, element) {
    const item = element.attributes;
    item.OperationType = receivePlanTypeOperationOperationTypeEnum(element.attributes.OperationType);
    context.startElement({
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value) => { item.QueryPlan = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, item.OperationType);
                planNode.metrics.add("General", "Operation Type", item.OperationType, 0);
            }
        }
    });
}
function OrderByTypeOrderByColumnFactory(context, element) {
    const item = element.attributes;
    item.Ascending = bool(element.attributes.Ascending);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.ColumnReference = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function DefinedValuesListTypeDefinedValueFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "ValueVector": {
                initializer: DefinedValuesListTypeValueVectorFactory,
                setter: (value) => { item.ValueVector = value; }
            },
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { item.ColumnReference = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value) => { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function DefinedValuesListTypeValueVectorFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function RunTimeInformationTypeRunTimeCountersPerThreadFactory(context, element) {
    const item = element.attributes;
    item.Thread = int(element.attributes.Thread);
    item.BrickId = int(element.attributes.BrickId);
    item.ActualRebinds = int(element.attributes.ActualRebinds);
    item.ActualRewinds = int(element.attributes.ActualRewinds);
    item.ActualRows = int(element.attributes.ActualRows);
    item.RowRequalifications = int(element.attributes.RowRequalifications);
    item.ActualRowsRead = int(element.attributes.ActualRowsRead);
    item.Batches = int(element.attributes.Batches);
    item.ActualEndOfScans = int(element.attributes.ActualEndOfScans);
    item.ActualExecutions = int(element.attributes.ActualExecutions);
    item.TaskAddr = int(element.attributes.TaskAddr);
    item.SchedulerId = int(element.attributes.SchedulerId);
    item.FirstActiveTime = int(element.attributes.FirstActiveTime);
    item.LastActiveTime = int(element.attributes.LastActiveTime);
    item.OpenTime = int(element.attributes.OpenTime);
    item.FirstRowTime = int(element.attributes.FirstRowTime);
    item.LastRowTime = int(element.attributes.LastRowTime);
    item.CloseTime = int(element.attributes.CloseTime);
    item.ActualElapsedms = int(element.attributes.ActualElapsedms);
    item.ActualCPUms = int(element.attributes.ActualCPUms);
    item.ActualScans = int(element.attributes.ActualScans);
    item.ActualLogicalReads = int(element.attributes.ActualLogicalReads);
    item.ActualPhysicalReads = int(element.attributes.ActualPhysicalReads);
    item.ActualPageServerReads = int(element.attributes.ActualPageServerReads);
    item.ActualReadAheads = int(element.attributes.ActualReadAheads);
    item.ActualPageServerReadAheads = int(element.attributes.ActualPageServerReadAheads);
    item.ActualLobLogicalReads = int(element.attributes.ActualLobLogicalReads);
    item.ActualLobPhysicalReads = int(element.attributes.ActualLobPhysicalReads);
    item.ActualLobPageServerReads = int(element.attributes.ActualLobPageServerReads);
    item.ActualLobReadAheads = int(element.attributes.ActualLobReadAheads);
    item.ActualLobPageServerReadAheads = int(element.attributes.ActualLobPageServerReadAheads);
    item.SegmentReads = int(element.attributes.SegmentReads);
    item.SegmentSkips = int(element.attributes.SegmentSkips);
    item.ActualLocallyAggregatedRows = int(element.attributes.ActualLocallyAggregatedRows);
    item.InputMemoryGrant = int(element.attributes.InputMemoryGrant);
    item.OutputMemoryGrant = int(element.attributes.OutputMemoryGrant);
    item.UsedMemoryGrant = int(element.attributes.UsedMemoryGrant);
    item.IsInterleavedExecuted = bool(element.attributes.IsInterleavedExecuted);
    item.ActualJoinType = physicalOpType(element.attributes.ActualJoinType);
    item.HpcRowCount = int(element.attributes.HpcRowCount);
    item.HpcKernelElapsedUs = int(element.attributes.HpcKernelElapsedUs);
    item.HpcHostToDeviceBytes = int(element.attributes.HpcHostToDeviceBytes);
    item.HpcDeviceToHostBytes = int(element.attributes.HpcDeviceToHostBytes);
    item.ActualPageServerPushedPageIDs = int(element.attributes.ActualPageServerPushedPageIDs);
    item.ActualPageServerRowsReturned = int(element.attributes.ActualPageServerRowsReturned);
    item.ActualPageServerRowsRead = int(element.attributes.ActualPageServerRowsRead);
    item.ActualPageServerPushedReads = int(element.attributes.ActualPageServerPushedReads);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function RunTimePartitionSummaryTypePartitionsAccessedFactory(context, element) {
    const item = element.attributes;
    item.PartitionCount = int(element.attributes.PartitionCount);
    item.PartitionRange = [];
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "PartitionRange": {
                initializer: RunTimePartitionSummaryTypePartitionRangeFactory,
                setter: (value) => { item.PartitionRange.push(value); }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function RunTimePartitionSummaryTypePartitionRangeFactory(context, element) {
    const item = element.attributes;
    item.Start = int(element.attributes.Start);
    item.End = int(element.attributes.End);
    context.startElement({
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function ConstantScanTypeValuesFactory(context, element) {
    const items = [];
    context.startElement({
        item: items,
        element: element,
        childElements: {
            "Row": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value) => { items.push(value); }
            },
        },
    });
}
function ParallelismTypeActivationFactory(context, element) {
    const item = element.attributes;
    item.Type = parallelismTypeActivationTypeEnum(element.attributes.Type);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "parallelism_activation", item.Object);
            }
        }
    });
}
function ParallelismTypeBrickRoutingFactory(context, element) {
    const item = element.attributes;
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value) => { item.Object = value; }
            },
            "FragmentIdColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value) => { item.FragmentIdColumn = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                binders.ObjectTypeBinder(planNode, "parallelism_brick_routing", item.Object);
                binders.SingleColumnReferenceTypeBinder(planNode, "fragment_id", item.FragmentIdColumn);
            }
        }
    });
}
function ShowPlanXMLFactory(context, element) {
    const item = element.attributes;
    item.ClusteredMode = bool(element.attributes.ClusteredMode);
    context.startElement({
        item: item,
        element: element,
        childElements: {
            "BatchSequence": {
                initializer: BatchSequenceFactory,
                setter: (value) => { item.BatchSequence = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
//# sourceMappingURL=saxfactory.js.map