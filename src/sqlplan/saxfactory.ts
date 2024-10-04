import { ParserContext } from "./saxparser";
import * as binders from "./binders";

import { PlanNode } from "./model";

export declare type ItemFactory = (context: ParserContext, input: InputElement) => void;

export interface InputElement {
    name: string;
    attributes: { [key: string]: string };
}
export interface ItemContext {

    element?: InputElement;
    childElements?: {
        [name: string]: {
            initializer: ItemFactory,
            setter: (value: any) => void,
        }
    };

    isBatch?: boolean;
    isStatement?: boolean;
    isNode?: boolean;
    planNode?: PlanNode;
    item: any;

    finalize?: (self: ItemContext, context: ParserContext, ) => void;
}

export const rootFactory = ShowPlanXMLFactory;


function baseStmtInfoTypeStatementOptmEarlyAbortReasonEnum(data: string): string {
    
    if (data) {
        switch (data) { 
            case "TimeOut": return "Time Out";

            case "MemoryLimitExceeded": return "Memory Limit Exceeded";

            case "GoodEnoughPlanFound": return "Good Enough Plan Found";
        }
    } 
    
    return data;
}
function cursorPlanTypeOperationOperationTypeEnum(data: string): string {
    
    if (data) {
        switch (data) { 
            case "FetchQuery": return "Fetch Query";

            case "PopulateQuery": return "Populate Query";

            case "RefreshQuery": return "Refresh Query";
        }
    } 
    
    return data;
}
function receivePlanTypeOperationOperationTypeEnum(data: string): string {
    
    if (data) {
        switch (data) { 
            case "ReceivePlanSelect": return "Receive Plan Select";

            case "ReceivePlanUpdate": return "Receive Plan Update";
        }
    } 
    
    return data;
}
function parallelismTypeActivationTypeEnum(data: string): string {
    
    if (data) {
        switch (data) { 
            case "CloneLocation": return "Clone Location";

            case "SingleBrick": return "Single Brick";
        }
    } 
    
    return data;
}
function storageType(data: string): string {
    
    if (data) {
        switch (data) { 
            case "RowStore": return "Row Store";

            case "ColumnStore": return "Column Store";

            case "MemoryOptimized": return "Memory Optimized";
        }
    } 
    
    return data;
}
function cursorType(data: string): string {
    
    if (data) {
        switch (data) { 
            case "FastForward": return "Fast Forward";

            case "SnapShot": return "Snap Shot";
        }
    } 
    
    return data;
}
function partitionType(data: string): string {
    
    if (data) {
        switch (data) { 
            case "NoPartitioning": return "No Partitioning";

            case "RoundRobin": return "Round Robin";

            case "CloneLocation": return "Clone Location";
        }
    } 
    
    return data;
}
function logicalOperationType(data: string): string {
    
    if (data) {
        switch (data) { 
            case "IsFalseOrNull": return "Is False Or Null";
        }
    } 
    
    return data;
}
function logicalOpType(data: string): string {
    
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
function physicalOpType(data: string): string {
    
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
function indexKindType(data: string): string {
    
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
function cloneAccessScopeType(data: string): string {
    
    if (data) {
        switch (data) { 
            case "ExactMatch": return "Exact Match";
        }
    } 
    
    return data;
}

function int(data: string | undefined ): number | undefined { 
    if (data !== undefined) {
        return parseInt(data);
    }
}

function float(data: string | undefined ): number | undefined { 
    if (data !== undefined) {
        return parseFloat(data);
    }
}


function onoff(data: string): "ON" | "OFF" { return bool(data) ? "ON" : "OFF"; }

function bool(data: string): boolean {
    if (data) {
        data = data.toLowerCase();
        if (data === "yes") return true;
        if (data === "true") return true;
        if (data === "1") return true;
    }
    return false;
}




function BaseStmtInfoTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as BaseStmtInfoType;
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
                setter: (value)=> { item.StatementSetOptions = value; }
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
function RelOpBaseTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RelOpBaseType;


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function RowsetTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RowsetType;
    item.Object = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function SortTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SortType;
    item.Distinct = bool(element.attributes.Distinct);





    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "OrderBy": {
                initializer: OrderByTypeFactory,
                setter: (value)=> { item.OrderBy = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Distinct) { planNode.flags.push("Distinct"); }
                binders.OrderByTypeBinder(planNode, "orderby", item.OrderBy);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ConcatTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ConcatType;
    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function RemoteTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RemoteType;


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function RemoteQueryTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RemoteQueryType;


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function ScalarExpressionTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ScalarExpressionType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ExternalDistributedComputationTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ExternalDistributedComputationType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "StmtSimple": {
                initializer: StmtSimpleTypeFactory,
                setter: (value)=> { item.StmtSimple = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtBlockTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtBlockType;






    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ExternalDistributedComputation": {
                initializer: ExternalDistributedComputationTypeFactory,
                setter: (value)=> { item.ExternalDistributedComputation = value; }
            },
            "StmtSimple": {
                initializer: StmtSimpleTypeFactory,
                setter: (value)=> { item.StmtSimple = value; }
            },
            "StmtCond": {
                initializer: StmtCondTypeFactory,
                setter: (value)=> { item.StmtCond = value; }
            },
            "StmtCursor": {
                initializer: StmtCursorTypeFactory,
                setter: (value)=> { item.StmtCursor = value; }
            },
            "StmtReceive": {
                initializer: StmtReceiveTypeFactory,
                setter: (value)=> { item.StmtReceive = value; }
            },
            "StmtUseDb": {
                initializer: StmtUseDbTypeFactory,
                setter: (value)=> { item.StmtUseDb = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtSimpleTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtSimpleType;
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
                setter: (value)=> { item.Dispatcher = value; }
            },
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value)=> { item.QueryPlan = value; }
            },
            "UDF": {
                initializer: FunctionTypeFactory,
                setter: (value)=> { item.UDF.push(value);  }
            },
            "StoredProc": {
                initializer: FunctionTypeFactory,
                setter: (value)=> { item.StoredProc = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value)=> { item.StatementSetOptions = value; }
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
function StmtUseDbTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtUseDbType;
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
                setter: (value)=> { item.StatementSetOptions = value; }
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
function StmtCondTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtCondType;
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
                setter: (value)=> { item.Condition = value; }
            },
            "Then": {
                initializer: StmtCondTypeThenFactory,
                setter: (value)=> { item.Then = value; }
            },
            "Else": {
                initializer: StmtCondTypeElseFactory,
                setter: (value)=> { item.Else = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value)=> { item.StatementSetOptions = value; }
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
function StmtCursorTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtCursorType;
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
                setter: (value)=> { item.CursorPlan = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value)=> { item.StatementSetOptions = value; }
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
function StmtReceiveTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtReceiveType;
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
                setter: (value)=> { item.ReceivePlan = value; }
            },
            "StatementSetOptions": {
                initializer: SetOptionsTypeFactory,
                setter: (value)=> { item.StatementSetOptions = value; }
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
function FunctionTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as FunctionType;
    item.IsNativelyCompiled = bool(element.attributes.IsNativelyCompiled);

    context.startElement({
        
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value)=> { item.Statements = value; }
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
function CursorPlanTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as CursorPlanType;
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
                setter: (value)=> { item.Operation.push(value);  }
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
function ReceivePlanTypeFactory(context: ParserContext, element: InputElement) {
    const items: ReceivePlanTypeOperation[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Operation": {
                initializer: ReceivePlanTypeOperationFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function ColumnReferenceTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ColumnReferenceType;
    item.ComputedColumn = bool(element.attributes.ComputedColumn);


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SingleColumnReferenceTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SingleColumnReferenceType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.ColumnReference = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ColumnReferenceListTypeFactory(context: ParserContext, element: InputElement) {
    const items: ColumnReferenceType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function ScanRangeTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ScanRangeType;


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RangeColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.RangeColumns = value; }
            },
            "RangeExpressions": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value)=> { item.RangeExpressions = value; }
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
function SeekPredicateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SeekPredicateType;




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Prefix": {
                initializer: ScanRangeTypeFactory,
                setter: (value)=> { item.Prefix = value; }
            },
            "StartRange": {
                initializer: ScanRangeTypeFactory,
                setter: (value)=> { item.StartRange = value; }
            },
            "EndRange": {
                initializer: ScanRangeTypeFactory,
                setter: (value)=> { item.EndRange = value; }
            },
            "IsNotNull": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.IsNotNull = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SeekPredicateNewTypeFactory(context: ParserContext, element: InputElement) {
    const items: SeekPredicateType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "SeekKeys": {
                initializer: SeekPredicateTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function SeekPredicatePartTypeFactory(context: ParserContext, element: InputElement) {
    const items: SeekPredicateNewType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function SeekPredicatesTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SeekPredicatesType;
    item.SeekPredicate = [];
    item.SeekPredicateNew = [];
    item.SeekPredicatePart = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "SeekPredicate": {
                initializer: SeekPredicateTypeFactory,
                setter: (value)=> { item.SeekPredicate.push(value);  }
            },
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value)=> { item.SeekPredicateNew.push(value);  }
            },
            "SeekPredicatePart": {
                initializer: SeekPredicatePartTypeFactory,
                setter: (value)=> { item.SeekPredicatePart.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ObjectTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ObjectType;
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
function OrderByTypeFactory(context: ParserContext, element: InputElement) {
    const items: OrderByTypeOrderByColumn[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "OrderByColumn": {
                initializer: OrderByTypeOrderByColumnFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function DefinedValuesListTypeFactory(context: ParserContext, element: InputElement) {
    const items: DefinedValuesListTypeDefinedValue[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "DefinedValue": {
                initializer: DefinedValuesListTypeDefinedValueFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function SpillToTempDbTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SpillToTempDbType;
    item.SpillLevel = int(element.attributes.SpillLevel);
    item.SpilledThreadCount = int(element.attributes.SpilledThreadCount);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function SortSpillDetailsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SortSpillDetailsType;
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
function HashSpillDetailsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as HashSpillDetailsType;
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
function ExchangeSpillDetailsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ExchangeSpillDetailsType;
    item.WritesToTempDb = int(element.attributes.WritesToTempDb);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WaitWarningTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as WaitWarningType;
    item.WaitTime = int(element.attributes.WaitTime);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WaitStatTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as WaitStatType;
    item.WaitTimeMs = int(element.attributes.WaitTimeMs);
    item.WaitCount = int(element.attributes.WaitCount);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WaitStatListTypeFactory(context: ParserContext, element: InputElement) {
    const items: WaitStatType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Wait": {
                initializer: WaitStatTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function QueryExecTimeTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as QueryExecTimeType;
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
function AffectingConvertWarningTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as AffectingConvertWarningType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function WarningsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as WarningsType;
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
                setter: (value)=> { item.SpillOccurred = value; }
            },
            "ColumnsWithNoStatistics": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.ColumnsWithNoStatistics = value; }
            },
            "ColumnsWithStaleStatistics": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.ColumnsWithStaleStatistics = value; }
            },
            "SpillToTempDb": {
                initializer: SpillToTempDbTypeFactory,
                setter: (value)=> { item.SpillToTempDb.push(value);  }
            },
            "Wait": {
                initializer: WaitWarningTypeFactory,
                setter: (value)=> { item.Wait.push(value);  }
            },
            "PlanAffectingConvert": {
                initializer: AffectingConvertWarningTypeFactory,
                setter: (value)=> { item.PlanAffectingConvert.push(value);  }
            },
            "SortSpillDetails": {
                initializer: SortSpillDetailsTypeFactory,
                setter: (value)=> { item.SortSpillDetails.push(value);  }
            },
            "HashSpillDetails": {
                initializer: HashSpillDetailsTypeFactory,
                setter: (value)=> { item.HashSpillDetails.push(value);  }
            },
            "ExchangeSpillDetails": {
                initializer: ExchangeSpillDetailsTypeFactory,
                setter: (value)=> { item.ExchangeSpillDetails.push(value);  }
            },
            "MemoryGrantWarning": {
                initializer: MemoryGrantWarningInfoFactory,
                setter: (value)=> { item.MemoryGrantWarning = value; }
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
function SpillOccurredTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SpillOccurredType;
    item.Detail = bool(element.attributes.Detail);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function MemoryFractionsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MemoryFractionsType;
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
function MemoryGrantTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MemoryGrantType;
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
function MemoryGrantWarningInfoFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MemoryGrantWarningInfo;
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
function TraceFlagTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as TraceFlagType;
    item.Value = int(element.attributes.Value);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function TraceFlagListTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as TraceFlagListType;
    item.IsCompileTime = bool(element.attributes.IsCompileTime);
    item.TraceFlag = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "TraceFlag": {
                initializer: TraceFlagTypeFactory,
                setter: (value)=> { item.TraceFlag.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function OptimizerHardwareDependentPropertiesTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as OptimizerHardwareDependentPropertiesType;
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
function StatsInfoTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StatsInfoType;
    item.ModificationCount = int(element.attributes.ModificationCount);
    item.SamplingPercent = float(element.attributes.SamplingPercent);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function OptimizerStatsUsageTypeFactory(context: ParserContext, element: InputElement) {
    const items: StatsInfoType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "StatisticsInfo": {
                initializer: StatsInfoTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function RunTimeInformationTypeFactory(context: ParserContext, element: InputElement) {
    const items: RunTimeInformationTypeRunTimeCountersPerThread[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "RunTimeCountersPerThread": {
                initializer: RunTimeInformationTypeRunTimeCountersPerThreadFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function RunTimePartitionSummaryTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RunTimePartitionSummaryType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "PartitionsAccessed": {
                initializer: RunTimePartitionSummaryTypePartitionsAccessedFactory,
                setter: (value)=> { item.PartitionsAccessed = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function IndexedViewInfoTypeFactory(context: ParserContext, element: InputElement) {
    const items: ObjectType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function RollupInfoTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RollupInfoType;
    item.HighestLevel = int(element.attributes.HighestLevel);
    item.RollupLevel = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RollupLevel": {
                initializer: RollupLevelTypeFactory,
                setter: (value)=> { item.RollupLevel.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function RollupLevelTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RollupLevelType;
    item.Level = int(element.attributes.Level);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function StarJoinInfoTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StarJoinInfoType;
    item.Root = bool(element.attributes.Root);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function InternalInfoTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as InternalInfoType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function OptimizationReplayTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as OptimizationReplayType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function ThreadStatTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ThreadStatType;
    item.Branches = int(element.attributes.Branches);
    item.UsedThreads = int(element.attributes.UsedThreads);
    item.ThreadReservation = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ThreadReservation": {
                initializer: ThreadReservationTypeFactory,
                setter: (value)=> { item.ThreadReservation.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ThreadReservationTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ThreadReservationType;
    item.NodeId = int(element.attributes.NodeId);
    item.ReservedThreads = int(element.attributes.ReservedThreads);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function MissingIndexesTypeFactory(context: ParserContext, element: InputElement) {
    const items: MissingIndexGroupType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "MissingIndexGroup": {
                initializer: MissingIndexGroupTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function MissingIndexGroupTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MissingIndexGroupType;
    item.Impact = float(element.attributes.Impact);
    item.MissingIndex = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "MissingIndex": {
                initializer: MissingIndexTypeFactory,
                setter: (value)=> { item.MissingIndex.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function MissingIndexTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MissingIndexType;
    item.ColumnGroup = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ColumnGroup": {
                initializer: ColumnGroupTypeFactory,
                setter: (value)=> { item.ColumnGroup.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ColumnGroupTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ColumnGroupType;
    item.Column = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Column": {
                initializer: ColumnTypeFactory,
                setter: (value)=> { item.Column.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ColumnTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ColumnType;
    item.ColumnId = int(element.attributes.ColumnId);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function QueryPlanTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as QueryPlanType;
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
                setter: (value)=> { item.InternalInfo = value; }
            },
            "OptimizationReplay": {
                initializer: OptimizationReplayTypeFactory,
                setter: (value)=> { item.OptimizationReplay = value; }
            },
            "ThreadStat": {
                initializer: ThreadStatTypeFactory,
                setter: (value)=> { item.ThreadStat = value; }
            },
            "MissingIndexes": {
                initializer: MissingIndexesTypeFactory,
                setter: (value)=> { item.MissingIndexes = value; }
            },
            "GuessedSelectivity": {
                initializer: GuessedSelectivityTypeFactory,
                setter: (value)=> { item.GuessedSelectivity = value; }
            },
            "UnmatchedIndexes": {
                initializer: UnmatchedIndexesTypeFactory,
                setter: (value)=> { item.UnmatchedIndexes = value; }
            },
            "Warnings": {
                initializer: WarningsTypeFactory,
                setter: (value)=> { item.Warnings = value; }
            },
            "MemoryGrantInfo": {
                initializer: MemoryGrantTypeFactory,
                setter: (value)=> { item.MemoryGrantInfo = value; }
            },
            "OptimizerHardwareDependentProperties": {
                initializer: OptimizerHardwareDependentPropertiesTypeFactory,
                setter: (value)=> { item.OptimizerHardwareDependentProperties = value; }
            },
            "OptimizerStatsUsage": {
                initializer: OptimizerStatsUsageTypeFactory,
                setter: (value)=> { item.OptimizerStatsUsage = value; }
            },
            "TraceFlags": {
                initializer: TraceFlagListTypeFactory,
                setter: (value)=> { item.TraceFlags.push(value);  }
            },
            "WaitStats": {
                initializer: WaitStatListTypeFactory,
                setter: (value)=> { item.WaitStats = value; }
            },
            "QueryTimeStats": {
                initializer: QueryExecTimeTypeFactory,
                setter: (value)=> { item.QueryTimeStats = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "ParameterList": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.ParameterList = value; }
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
function GuessedSelectivityTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as GuessedSelectivityType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Spatial": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Spatial = value; }
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
function UnmatchedIndexesTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as UnmatchedIndexesType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Parameterization": {
                initializer: ParameterizationTypeFactory,
                setter: (value)=> { item.Parameterization = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ParameterizationTypeFactory(context: ParserContext, element: InputElement) {
    const items: ObjectType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function RelOpTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RelOpType;
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
                setter: (value)=> { item.AdaptiveJoin = value; }
            },
            "Apply": {
                initializer: JoinTypeFactory,
                setter: (value)=> { item.Apply = value; }
            },
            "Assert": {
                initializer: FilterTypeFactory,
                setter: (value)=> { item.Assert = value; }
            },
            "BatchHashTableBuild": {
                initializer: BatchHashTableBuildTypeFactory,
                setter: (value)=> { item.BatchHashTableBuild = value; }
            },
            "Bitmap": {
                initializer: BitmapTypeFactory,
                setter: (value)=> { item.Bitmap = value; }
            },
            "Collapse": {
                initializer: CollapseTypeFactory,
                setter: (value)=> { item.Collapse = value; }
            },
            "ComputeScalar": {
                initializer: ComputeScalarTypeFactory,
                setter: (value)=> { item.ComputeScalar = value; }
            },
            "Concat": {
                initializer: ConcatTypeFactory,
                setter: (value)=> { item.Concat = value; }
            },
            "ConstantScan": {
                initializer: ConstantScanTypeFactory,
                setter: (value)=> { item.ConstantScan = value; }
            },
            "ConstTableGet": {
                initializer: GetTypeFactory,
                setter: (value)=> { item.ConstTableGet = value; }
            },
            "CreateIndex": {
                initializer: CreateIndexTypeFactory,
                setter: (value)=> { item.CreateIndex = value; }
            },
            "Delete": {
                initializer: DMLOpTypeFactory,
                setter: (value)=> { item.Delete = value; }
            },
            "DeletedScan": {
                initializer: RowsetTypeFactory,
                setter: (value)=> { item.DeletedScan = value; }
            },
            "Extension": {
                initializer: UDXTypeFactory,
                setter: (value)=> { item.Extension = value; }
            },
            "ExternalSelect": {
                initializer: ExternalSelectTypeFactory,
                setter: (value)=> { item.ExternalSelect = value; }
            },
            "ExtExtractScan": {
                initializer: RemoteTypeFactory,
                setter: (value)=> { item.ExtExtractScan = value; }
            },
            "Filter": {
                initializer: FilterTypeFactory,
                setter: (value)=> { item.Filter = value; }
            },
            "ForeignKeyReferencesCheck": {
                initializer: ForeignKeyReferencesCheckTypeFactory,
                setter: (value)=> { item.ForeignKeyReferencesCheck = value; }
            },
            "GbAgg": {
                initializer: GbAggTypeFactory,
                setter: (value)=> { item.GbAgg = value; }
            },
            "GbApply": {
                initializer: GbApplyTypeFactory,
                setter: (value)=> { item.GbApply = value; }
            },
            "Generic": {
                initializer: GenericTypeFactory,
                setter: (value)=> { item.Generic = value; }
            },
            "Get": {
                initializer: GetTypeFactory,
                setter: (value)=> { item.Get = value; }
            },
            "Hash": {
                initializer: HashTypeFactory,
                setter: (value)=> { item.Hash = value; }
            },
            "IndexScan": {
                initializer: IndexScanTypeFactory,
                setter: (value)=> { item.IndexScan = value; }
            },
            "InsertedScan": {
                initializer: RowsetTypeFactory,
                setter: (value)=> { item.InsertedScan = value; }
            },
            "Insert": {
                initializer: DMLOpTypeFactory,
                setter: (value)=> { item.Insert = value; }
            },
            "Join": {
                initializer: JoinTypeFactory,
                setter: (value)=> { item.Join = value; }
            },
            "LocalCube": {
                initializer: LocalCubeTypeFactory,
                setter: (value)=> { item.LocalCube = value; }
            },
            "LogRowScan": {
                initializer: RelOpBaseTypeFactory,
                setter: (value)=> { item.LogRowScan = value; }
            },
            "Merge": {
                initializer: MergeTypeFactory,
                setter: (value)=> { item.Merge = value; }
            },
            "MergeInterval": {
                initializer: SimpleIteratorOneChildTypeFactory,
                setter: (value)=> { item.MergeInterval = value; }
            },
            "Move": {
                initializer: MoveTypeFactory,
                setter: (value)=> { item.Move = value; }
            },
            "NestedLoops": {
                initializer: NestedLoopsTypeFactory,
                setter: (value)=> { item.NestedLoops = value; }
            },
            "OnlineIndex": {
                initializer: CreateIndexTypeFactory,
                setter: (value)=> { item.OnlineIndex = value; }
            },
            "Parallelism": {
                initializer: ParallelismTypeFactory,
                setter: (value)=> { item.Parallelism = value; }
            },
            "ParameterTableScan": {
                initializer: RelOpBaseTypeFactory,
                setter: (value)=> { item.ParameterTableScan = value; }
            },
            "PrintDataflow": {
                initializer: RelOpBaseTypeFactory,
                setter: (value)=> { item.PrintDataflow = value; }
            },
            "Project": {
                initializer: ProjectTypeFactory,
                setter: (value)=> { item.Project = value; }
            },
            "Put": {
                initializer: PutTypeFactory,
                setter: (value)=> { item.Put = value; }
            },
            "RemoteFetch": {
                initializer: RemoteFetchTypeFactory,
                setter: (value)=> { item.RemoteFetch = value; }
            },
            "RemoteModify": {
                initializer: RemoteModifyTypeFactory,
                setter: (value)=> { item.RemoteModify = value; }
            },
            "RemoteQuery": {
                initializer: RemoteQueryTypeFactory,
                setter: (value)=> { item.RemoteQuery = value; }
            },
            "RemoteRange": {
                initializer: RemoteRangeTypeFactory,
                setter: (value)=> { item.RemoteRange = value; }
            },
            "RemoteScan": {
                initializer: RemoteTypeFactory,
                setter: (value)=> { item.RemoteScan = value; }
            },
            "RowCountSpool": {
                initializer: SpoolTypeFactory,
                setter: (value)=> { item.RowCountSpool = value; }
            },
            "ScalarInsert": {
                initializer: ScalarInsertTypeFactory,
                setter: (value)=> { item.ScalarInsert = value; }
            },
            "Segment": {
                initializer: SegmentTypeFactory,
                setter: (value)=> { item.Segment = value; }
            },
            "Sequence": {
                initializer: SequenceTypeFactory,
                setter: (value)=> { item.Sequence = value; }
            },
            "SequenceProject": {
                initializer: ComputeScalarTypeFactory,
                setter: (value)=> { item.SequenceProject = value; }
            },
            "SimpleUpdate": {
                initializer: SimpleUpdateTypeFactory,
                setter: (value)=> { item.SimpleUpdate = value; }
            },
            "Sort": {
                initializer: SortTypeFactory,
                setter: (value)=> { item.Sort = value; }
            },
            "Split": {
                initializer: SplitTypeFactory,
                setter: (value)=> { item.Split = value; }
            },
            "Spool": {
                initializer: SpoolTypeFactory,
                setter: (value)=> { item.Spool = value; }
            },
            "StreamAggregate": {
                initializer: StreamAggregateTypeFactory,
                setter: (value)=> { item.StreamAggregate = value; }
            },
            "Switch": {
                initializer: SwitchTypeFactory,
                setter: (value)=> { item.Switch = value; }
            },
            "TableScan": {
                initializer: TableScanTypeFactory,
                setter: (value)=> { item.TableScan = value; }
            },
            "TableValuedFunction": {
                initializer: TableValuedFunctionTypeFactory,
                setter: (value)=> { item.TableValuedFunction = value; }
            },
            "Top": {
                initializer: TopTypeFactory,
                setter: (value)=> { item.Top = value; }
            },
            "TopSort": {
                initializer: TopSortTypeFactory,
                setter: (value)=> { item.TopSort = value; }
            },
            "Update": {
                initializer: UpdateTypeFactory,
                setter: (value)=> { item.Update = value; }
            },
            "Update": {
                initializer: UpdateTypeFactory,
                setter: (value)=> { item.Update = value; }
            },
            "Union": {
                initializer: ConcatTypeFactory,
                setter: (value)=> { item.Union = value; }
            },
            "UnionAll": {
                initializer: ConcatTypeFactory,
                setter: (value)=> { item.UnionAll = value; }
            },
            "WindowSpool": {
                initializer: WindowTypeFactory,
                setter: (value)=> { item.WindowSpool = value; }
            },
            "WindowAggregate": {
                initializer: WindowAggregateTypeFactory,
                setter: (value)=> { item.WindowAggregate = value; }
            },
            "XcsScan": {
                initializer: XcsScanTypeFactory,
                setter: (value)=> { item.XcsScan = value; }
            },
            "OutputList": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.OutputList = value; }
            },
            "Warnings": {
                initializer: WarningsTypeFactory,
                setter: (value)=> { item.Warnings = value; }
            },
            "MemoryFractions": {
                initializer: MemoryFractionsTypeFactory,
                setter: (value)=> { item.MemoryFractions = value; }
            },
            "RunTimeInformation": {
                initializer: RunTimeInformationTypeFactory,
                setter: (value)=> { item.RunTimeInformation = value; }
            },
            "RunTimePartitionSummary": {
                initializer: RunTimePartitionSummaryTypeFactory,
                setter: (value)=> { item.RunTimePartitionSummary = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, item.PhysicalOp, item.LogicalOp);
                if (item.GroupExecuted) { planNode.flags.push("Group Executed"); }
                if (item.Parallel) { planNode.flags.push("Parallel"); }
                if (item.RemoteDataAccess) { planNode.flags.push("Remote Data Access"); }
                if (item.Partitioned) { planNode.flags.push("Partitioned"); }
                if (item.IsAdaptive) { planNode.flags.push("Is Adaptive"); }
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
function AdaptiveJoinTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as AdaptiveJoinType;
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
                setter: (value)=> { item.HashKeysBuild = value; }
            },
            "HashKeysProbe": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.HashKeysProbe = value; }
            },
            "BuildResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.BuildResidual = value; }
            },
            "ProbeResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.ProbeResidual = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value)=> { item.StarJoinInfo = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
            "PassThru": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.PassThru = value; }
            },
            "OuterReferences": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.OuterReferences = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.BitmapCreator) { planNode.flags.push("Bitmap Creator"); }
                if (item.Optimized) { planNode.flags.push("Optimized"); }
                if (item.WithOrderedPrefetch) { planNode.flags.push("With Ordered Prefetch"); }
                if (item.WithUnorderedPrefetch) { planNode.flags.push("With Unordered Prefetch"); }
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
function ForeignKeyReferencesCheckTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ForeignKeyReferencesCheckType;
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
                setter: (value)=> { item.RelOp = value; }
            },
            "ForeignKeyReferenceCheck": {
                initializer: ForeignKeyReferenceCheckTypeFactory,
                setter: (value)=> { item.ForeignKeyReferenceCheck.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.ForeignKeyReferencesCount) { planNode.flags.push(`Foreign Key Count: ${item.ForeignKeyReferencesCount}`); }
                if (item.NoMatchingIndexCount) { planNode.flags.push(`No Matching Count: ${item.NoMatchingIndexCount}`); }
                if (item.PartialMatchingIndexCount) { planNode.flags.push(`Partial Count: ${item.PartialMatchingIndexCount}`); }
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ForeignKeyReferenceCheckTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ForeignKeyReferenceCheckType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "IndexScan": {
                initializer: IndexScanTypeFactory,
                setter: (value)=> { item.IndexScan = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SimpleIteratorOneChildTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SimpleIteratorOneChildType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function FilterTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as FilterType;
    item.StartupExpression = bool(element.attributes.StartupExpression);




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.StartupExpression) { planNode.flags.push("Startup Expression"); }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ConstantScanTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ConstantScanType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Values": {
                initializer: ConstantScanTypeValuesFactory,
                setter: (value)=> { item.Values = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function TableScanTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as TableScanType;
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
                setter: (value)=> { item.Predicate = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "IndexedViewInfo": {
                initializer: IndexedViewInfoTypeFactory,
                setter: (value)=> { item.IndexedViewInfo = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Ordered) { planNode.flags.push("Ordered"); }
                if (item.ForcedIndex) { planNode.flags.push("Forced Index"); }
                if (item.ForceScan) { planNode.flags.push("Force Scan"); }
                if (item.NoExpandHint) { planNode.flags.push("No Expand Hint"); }
                if (item.Storage) { planNode.flags.push("Storage"); }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function XcsScanTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as XcsScanType;
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
                setter: (value)=> { item.Predicate = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "IndexedViewInfo": {
                initializer: IndexedViewInfoTypeFactory,
                setter: (value)=> { item.IndexedViewInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Ordered) { planNode.flags.push("Ordered"); }
                if (item.ForcedIndex) { planNode.flags.push("Forced Index"); }
                if (item.ForceScan) { planNode.flags.push("Force Scan"); }
                if (item.NoExpandHint) { planNode.flags.push("No Expand Hint"); }
                if (item.Storage) { planNode.flags.push("Storage"); }
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function IndexScanTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as IndexScanType;
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
                setter: (value)=> { item.SeekPredicates = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "IndexedViewInfo": {
                initializer: IndexedViewInfoTypeFactory,
                setter: (value)=> { item.IndexedViewInfo = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Lookup) { planNode.flags.push("Lookup"); }
                if (item.Ordered) { planNode.flags.push("Ordered"); }
                if (item.ScanDirection) { planNode.flags.push(`${item.ScanDirection}`); }
                if (item.ForcedIndex) { planNode.flags.push("Forced Index"); }
                if (item.ForceSeek) { planNode.flags.push(`Force Seek (${item.ForceSeekColumnCount} columns)`); }
                if (item.ForceScan) { planNode.flags.push("Force Scan"); }
                if (item.NoExpandHint) { planNode.flags.push("No Expand Hint"); }
                if (item.Storage) { planNode.flags.push(`${item.Storage}`); }
                if (item.DynamicSeek) { planNode.flags.push(`${item.DynamicSeek}`); }
                if (item.SBSFileUrl) { planNode.flags.push("SBSFile Url"); }
                binders.SeekPredicatesTypeBinder(planNode, "seek_predicate", item.SeekPredicates);
                binders.ScalarExpressionTypeBinder(planNode, "predicate", item.Predicate);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function TableValuedFunctionTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as TableValuedFunctionType;






    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "ParameterList": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value)=> { item.ParameterList = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function HashTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as HashType;
    item.BitmapCreator = bool(element.attributes.BitmapCreator);





    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "HashKeysBuild": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.HashKeysBuild = value; }
            },
            "HashKeysProbe": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.HashKeysProbe = value; }
            },
            "BuildResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.BuildResidual = value; }
            },
            "ProbeResidual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.ProbeResidual = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value)=> { item.StarJoinInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.BitmapCreator) { planNode.flags.push("Bitmap Creator"); }
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
function ComputeScalarTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ComputeScalarType;
    item.ComputeSequence = bool(element.attributes.ComputeSequence);



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.ComputeSequence) { planNode.flags.push("Compute Sequence"); }
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ParallelismTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ParallelismType;
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
                setter: (value)=> { item.PartitionColumns = value; }
            },
            "OrderBy": {
                initializer: OrderByTypeFactory,
                setter: (value)=> { item.OrderBy = value; }
            },
            "HashKeys": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.HashKeys = value; }
            },
            "ProbeColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.ProbeColumn = value; }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
            "Activation": {
                initializer: ParallelismTypeActivationFactory,
                setter: (value)=> { item.Activation = value; }
            },
            "BrickRouting": {
                initializer: ParallelismTypeBrickRoutingFactory,
                setter: (value)=> { item.BrickRouting = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.PartitioningType) { planNode.flags.push(`${item.PartitioningType}`); }
                if (item.Remoting) { planNode.flags.push("Remoting"); }
                if (item.LocalParallelism) { planNode.flags.push("Local Parallelism"); }
                if (item.InRow) { planNode.flags.push("In Row"); }
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
function StreamAggregateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StreamAggregateType;





    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.GroupBy = value; }
            },
            "RollupInfo": {
                initializer: RollupInfoTypeFactory,
                setter: (value)=> { item.RollupInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function BitmapTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as BitmapType;




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "HashKeys": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.HashKeys = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function CollapseTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as CollapseType;




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.GroupBy = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function SwitchTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SwitchType;

    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function MergeTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MergeType;
    item.ManyToMany = bool(element.attributes.ManyToMany);





    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "InnerSideJoinColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.InnerSideJoinColumns = value; }
            },
            "OuterSideJoinColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.OuterSideJoinColumns = value; }
            },
            "Residual": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Residual = value; }
            },
            "PassThru": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.PassThru = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value)=> { item.StarJoinInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.ManyToMany) { planNode.flags.push("Many To Many"); }
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
function NestedLoopsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as NestedLoopsType;
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
                setter: (value)=> { item.Predicate = value; }
            },
            "PassThru": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.PassThru = value; }
            },
            "OuterReferences": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.OuterReferences = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "ProbeColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.ProbeColumn = value; }
            },
            "StarJoinInfo": {
                initializer: StarJoinInfoTypeFactory,
                setter: (value)=> { item.StarJoinInfo = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Optimized) { planNode.flags.push("Optimized"); }
                if (item.WithOrderedPrefetch) { planNode.flags.push("With Ordered Prefetch"); }
                if (item.WithUnorderedPrefetch) { planNode.flags.push("With Unordered Prefetch"); }
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
function SegmentTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SegmentType;





    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.GroupBy = value; }
            },
            "SegmentColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.SegmentColumn = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function SequenceTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SequenceType;
    item.IsGraphDBTransitiveClosure = bool(element.attributes.IsGraphDBTransitiveClosure);
    item.GraphSequenceIdentifier = int(element.attributes.GraphSequenceIdentifier);
    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function SplitTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SplitType;




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ActionColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.ActionColumn = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function TopTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as TopType;
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
                setter: (value)=> { item.TieColumns = value; }
            },
            "OffsetExpression": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.OffsetExpression = value; }
            },
            "TopExpression": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.TopExpression = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function UDXTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as UDXType;




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "UsedUDXColumns": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.UsedUDXColumns = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.UDXName) { planNode.nameSet.push(item.UDXName); }
                binders.ColumnReferenceListTypeBinder(planNode, "udx", item.UsedUDXColumns);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function WindowTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as WindowType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function WindowAggregateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as WindowAggregateType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function PutTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as PutType;
    item.IsExternallyComputed = bool(element.attributes.IsExternallyComputed);



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function SimpleUpdateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SimpleUpdateType;
    item.DMLRequestSort = bool(element.attributes.DMLRequestSort);



    item.Object = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "SeekPredicate": {
                initializer: SeekPredicateTypeFactory,
                setter: (value)=> { item.SeekPredicate = value; }
            },
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value)=> { item.SeekPredicateNew = value; }
            },
            "SetPredicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.SetPredicate = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.DMLRequestSort) { planNode.flags.push("DMLRequest Sort"); }
                binders.SeekPredicateTypeBinder(planNode, "seek_predicate", item.SeekPredicate);
                binders.SeekPredicateNewTypeBinder(planNode, "seek_predicate", item.SeekPredicateNew);
                binders.ScalarExpressionTypeBinder(planNode, "set_predicate", item.SetPredicate);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function SetPredicateElementTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SetPredicateElementType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function UpdateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as UpdateType;
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
                setter: (value)=> { item.SetPredicate.push(value);  }
            },
            "ProbeColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.ProbeColumn = value; }
            },
            "ActionColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.ActionColumn = value; }
            },
            "OriginalActionColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.OriginalActionColumn = value; }
            },
            "AssignmentMap": {
                initializer: AssignmentMapTypeFactory,
                setter: (value)=> { item.AssignmentMap = value; }
            },
            "SourceTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value)=> { item.SourceTable = value; }
            },
            "TargetTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value)=> { item.TargetTable = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function CreateIndexTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as CreateIndexType;

    item.Object = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function SpoolTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SpoolType;
    item.Stack = bool(element.attributes.Stack);
    item.PrimaryNodeId = int(element.attributes.PrimaryNodeId);





    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "SeekPredicate": {
                initializer: SeekPredicateTypeFactory,
                setter: (value)=> { item.SeekPredicate = value; }
            },
            "SeekPredicateNew": {
                initializer: SeekPredicateNewTypeFactory,
                setter: (value)=> { item.SeekPredicateNew = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Stack) { planNode.flags.push("Stack"); }
                if (item.PrimaryNodeId) { planNode.flags.push(`Primary Node ID: ${item.PrimaryNodeId}`); }
                binders.SeekPredicateTypeBinder(planNode, "seek_predicate", item.SeekPredicate);
                binders.SeekPredicateNewTypeBinder(planNode, "seek_predicate", item.SeekPredicateNew);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function BatchHashTableBuildTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as BatchHashTableBuildType;
    item.BitmapCreator = bool(element.attributes.BitmapCreator);



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.BitmapCreator) { planNode.flags.push("Bitmap Creator"); }
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function ScalarInsertTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ScalarInsertType;
    item.DMLRequestSort = bool(element.attributes.DMLRequestSort);

    item.Object = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "SetPredicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.SetPredicate = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.DMLRequestSort) { planNode.flags.push("DMLRequest Sort"); }
                binders.ScalarExpressionTypeBinder(planNode, "set_predicate", item.SetPredicate);
                binders.ObjectTypeBinder(planNode, "rowset", item.Object);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function TopSortTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as TopSortType;
    item.Rows = int(element.attributes.Rows);
    item.WithTies = bool(element.attributes.WithTies);
    item.Distinct = bool(element.attributes.Distinct);





    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "OrderBy": {
                initializer: OrderByTypeFactory,
                setter: (value)=> { item.OrderBy = value; }
            },
            "PartitionId": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.PartitionId = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
            if (self.planNode) {
                const planNode = self.planNode;
                binders.nameSetTitle(planNode, null, null);
                if (item.Distinct) { planNode.flags.push("Distinct"); }
                binders.OrderByTypeBinder(planNode, "orderby", item.OrderBy);
                binders.SingleColumnReferenceTypeBinder(planNode, "partition", item.PartitionId);
                binders.DefinedValuesListTypeBinder(planNode, "defined_values", item.DefinedValues);
            }
        }
    });
}
function RemoteRangeTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RemoteRangeType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "SeekPredicates": {
                initializer: SeekPredicatesTypeFactory,
                setter: (value)=> { item.SeekPredicates = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function RemoteFetchTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RemoteFetchType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function RemoteModifyTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RemoteModifyType;




    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "SetPredicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.SetPredicate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function GenericTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as GenericType;
    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function ResourceEstimateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ResourceEstimateType;
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
function MoveTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as MoveType;
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
                setter: (value)=> { item.DistributionKey = value; }
            },
            "ResourceEstimate": {
                initializer: ResourceEstimateTypeFactory,
                setter: (value)=> { item.ResourceEstimate = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function ExternalSelectTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ExternalSelectType;
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
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function ProjectTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ProjectType;
    item.IsNoOp = bool(element.attributes.IsNoOp);
    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function JoinTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as JoinType;
    item.Predicate = [];
    item.Probe = [];
    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate.push(value);  }
            },
            "Probe": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.Probe.push(value);  }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function GbApplyTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as GbApplyType;
    item.Predicate = [];

    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate.push(value);  }
            },
            "AggFunctions": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.AggFunctions = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function GbAggTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as GbAggType;
    item.IsScalar = bool(element.attributes.IsScalar);


    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.GroupBy = value; }
            },
            "AggFunctions": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.AggFunctions = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function GroupingSetReferenceTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as GroupingSetReferenceType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function GroupingSetListTypeFactory(context: ParserContext, element: InputElement) {
    const items: GroupingSetReferenceType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "GroupingSet": {
                initializer: GroupingSetReferenceTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function LocalCubeTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as LocalCubeType;


    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "GroupBy": {
                initializer: ColumnReferenceListTypeFactory,
                setter: (value)=> { item.GroupBy = value; }
            },
            "GroupingSets": {
                initializer: GroupingSetListTypeFactory,
                setter: (value)=> { item.GroupingSets = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function DMLOpTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as DMLOpType;



    item.RelOp = [];


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "AssignmentMap": {
                initializer: AssignmentMapTypeFactory,
                setter: (value)=> { item.AssignmentMap = value; }
            },
            "SourceTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value)=> { item.SourceTable = value; }
            },
            "TargetTable": {
                initializer: ParameterizationTypeFactory,
                setter: (value)=> { item.TargetTable = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function AssignmentMapTypeFactory(context: ParserContext, element: InputElement) {
    const items: AssignType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Assign": {
                initializer: AssignTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function GetTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as GetType;
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
                setter: (value)=> { item.Bookmarks = value; }
            },
            "OutputColumns": {
                initializer: OutputColumnsTypeFactory,
                setter: (value)=> { item.OutputColumns = value; }
            },
            "GeneratedData": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value)=> { item.GeneratedData = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp.push(value);  }
            },
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
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
function OutputColumnsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as OutputColumnsType;

    item.Object = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "DefinedValues": {
                initializer: DefinedValuesListTypeFactory,
                setter: (value)=> { item.DefinedValues = value; }
            },
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ScalarTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ScalarType;


















    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Aggregate": {
                initializer: AggregateTypeFactory,
                setter: (value)=> { item.Aggregate = value; }
            },
            "Arithmetic": {
                initializer: ArithmeticTypeFactory,
                setter: (value)=> { item.Arithmetic = value; }
            },
            "Assign": {
                initializer: AssignTypeFactory,
                setter: (value)=> { item.Assign = value; }
            },
            "Compare": {
                initializer: CompareTypeFactory,
                setter: (value)=> { item.Compare = value; }
            },
            "Const": {
                initializer: ConstTypeFactory,
                setter: (value)=> { item.Const = value; }
            },
            "Convert": {
                initializer: ConvertTypeFactory,
                setter: (value)=> { item.Convert = value; }
            },
            "Identifier": {
                initializer: IdentTypeFactory,
                setter: (value)=> { item.Identifier = value; }
            },
            "IF": {
                initializer: ConditionalTypeFactory,
                setter: (value)=> { item.IF = value; }
            },
            "Intrinsic": {
                initializer: IntrinsicTypeFactory,
                setter: (value)=> { item.Intrinsic = value; }
            },
            "Logical": {
                initializer: LogicalTypeFactory,
                setter: (value)=> { item.Logical = value; }
            },
            "MultipleAssign": {
                initializer: MultAssignTypeFactory,
                setter: (value)=> { item.MultipleAssign = value; }
            },
            "ScalarExpressionList": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value)=> { item.ScalarExpressionList = value; }
            },
            "Sequence": {
                initializer: ScalarSequenceTypeFactory,
                setter: (value)=> { item.Sequence = value; }
            },
            "Subquery": {
                initializer: SubqueryTypeFactory,
                setter: (value)=> { item.Subquery = value; }
            },
            "UDTMethod": {
                initializer: UDTMethodTypeFactory,
                setter: (value)=> { item.UDTMethod = value; }
            },
            "UserDefinedAggregate": {
                initializer: UDAggregateTypeFactory,
                setter: (value)=> { item.UserDefinedAggregate = value; }
            },
            "UserDefinedFunction": {
                initializer: UDFTypeFactory,
                setter: (value)=> { item.UserDefinedFunction = value; }
            },
            "InternalInfo": {
                initializer: InternalInfoTypeFactory,
                setter: (value)=> { item.InternalInfo = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ScalarExpressionListTypeFactory(context: ParserContext, element: InputElement) {
    const items: ScalarType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function ConstTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ConstType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function IdentTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as IdentType;

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.ColumnReference = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function CompareTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as CompareType;
    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ConvertTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ConvertType;
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
                setter: (value)=> { item.Style = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ArithmeticTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ArithmeticType;
    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function LogicalTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as LogicalType;
    item.Operation = logicalOperationType(element.attributes.Operation);
    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function UDAggregateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as UDAggregateType;
    item.Distinct = bool(element.attributes.Distinct);

    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "UDAggObject": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.UDAggObject = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
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
function AggregateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as AggregateType;
    item.Distinct = bool(element.attributes.Distinct);
    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function AssignTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as AssignType;


    item.SourceColumn = [];
    item.TargetColumn = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.ColumnReference = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
            "SourceColumn": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.SourceColumn.push(value);  }
            },
            "TargetColumn": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.TargetColumn.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function MultAssignTypeFactory(context: ParserContext, element: InputElement) {
    const items: AssignType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Assign": {
                initializer: AssignTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function ConditionalTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ConditionalType;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Condition": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Condition = value; }
            },
            "Then": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Then = value; }
            },
            "Else": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Else = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function IntrinsicTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as IntrinsicType;
    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function ScalarSequenceTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ScalarSequenceType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function UDFTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as UDFType;
    item.IsClrFunction = bool(element.attributes.IsClrFunction);
    item.ScalarOperator = [];

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
            "CLRFunction": {
                initializer: CLRFunctionTypeFactory,
                setter: (value)=> { item.CLRFunction = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function UDTMethodTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as UDTMethodType;

    item.ScalarOperator = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "CLRFunction": {
                initializer: CLRFunctionTypeFactory,
                setter: (value)=> { item.CLRFunction = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function CLRFunctionTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as CLRFunctionType;
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function SubqueryTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SubqueryType;


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
            "RelOp": {
                initializer: RelOpTypeFactory,
                setter: (value)=> { item.RelOp = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function DispatcherTypeFactory(context: ParserContext, element: InputElement) {
    const items: ParameterSensitivePredicateType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "ParameterSensitivePredicate": {
                initializer: ParameterSensitivePredicateTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function ParameterSensitivePredicateTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ParameterSensitivePredicateType;
    item.LowBoundary = float(element.attributes.LowBoundary);
    item.HighBoundary = float(element.attributes.HighBoundary);
    item.StatisticsInfo = [];

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "StatisticsInfo": {
                initializer: StatsInfoTypeFactory,
                setter: (value)=> { item.StatisticsInfo.push(value);  }
            },
            "Predicate": {
                initializer: ScalarExpressionTypeFactory,
                setter: (value)=> { item.Predicate = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function SetOptionsTypeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as SetOptionsType;
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
function BatchSequenceFactory(context: ParserContext, element: InputElement) {
    const items: Batch[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Batch": {
                initializer: BatchFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function BatchFactory(context: ParserContext, element: InputElement) {
    const items: StmtBlockType[] = [];

    context.startElement({
        isBatch: true,
        item: items,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function StmtCondTypeConditionFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtCondTypeCondition;

    item.UDF = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value)=> { item.QueryPlan = value; }
            },
            "UDF": {
                initializer: FunctionTypeFactory,
                setter: (value)=> { item.UDF.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtCondTypeThenFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtCondTypeThen;

    context.startElement({
        
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value)=> { item.Statements = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function StmtCondTypeElseFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as StmtCondTypeElse;

    context.startElement({
        
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Statements": {
                initializer: StmtBlockTypeFactory,
                setter: (value)=> { item.Statements = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function CursorPlanTypeOperationFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as CursorPlanTypeOperation;
    item.OperationType = cursorPlanTypeOperationOperationTypeEnum(element.attributes.OperationType);


    item.UDF = [];
    context.startElement({
        
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "Dispatcher": {
                initializer: DispatcherTypeFactory,
                setter: (value)=> { item.Dispatcher = value; }
            },
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value)=> { item.QueryPlan = value; }
            },
            "UDF": {
                initializer: FunctionTypeFactory,
                setter: (value)=> { item.UDF.push(value);  }
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
function ReceivePlanTypeOperationFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ReceivePlanTypeOperation;
    item.OperationType = receivePlanTypeOperationOperationTypeEnum(element.attributes.OperationType);

    context.startElement({
        
        isNode: true,
        item: item,
        element: element,
        childElements: {
            "QueryPlan": {
                initializer: QueryPlanTypeFactory,
                setter: (value)=> { item.QueryPlan = value; }
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
function OrderByTypeOrderByColumnFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as OrderByTypeOrderByColumn;
    item.Ascending = bool(element.attributes.Ascending);

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.ColumnReference = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function DefinedValuesListTypeDefinedValueFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as DefinedValuesListTypeDefinedValue;



    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "ValueVector": {
                initializer: DefinedValuesListTypeValueVectorFactory,
                setter: (value)=> { item.ValueVector = value; }
            },
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { item.ColumnReference = value; }
            },
            "ScalarOperator": {
                initializer: ScalarTypeFactory,
                setter: (value)=> { item.ScalarOperator = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function DefinedValuesListTypeValueVectorFactory(context: ParserContext, element: InputElement) {
    const items: ColumnReferenceType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "ColumnReference": {
                initializer: ColumnReferenceTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function RunTimeInformationTypeRunTimeCountersPerThreadFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RunTimeInformationTypeRunTimeCountersPerThread;
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
function RunTimePartitionSummaryTypePartitionsAccessedFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RunTimePartitionSummaryTypePartitionsAccessed;
    item.PartitionCount = int(element.attributes.PartitionCount);
    item.PartitionRange = [];
    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "PartitionRange": {
                initializer: RunTimePartitionSummaryTypePartitionRangeFactory,
                setter: (value)=> { item.PartitionRange.push(value);  }
            },
        },
        finalize: (self, context) => {
        }
    });
}
function RunTimePartitionSummaryTypePartitionRangeFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as RunTimePartitionSummaryTypePartitionRange;
    item.Start = int(element.attributes.Start);
    item.End = int(element.attributes.End);
    context.startElement({
        
        item: item,
        element: element,
        finalize: (self, context) => {
        }
    });
}
function ConstantScanTypeValuesFactory(context: ParserContext, element: InputElement) {
    const items: ScalarExpressionListType[] = [];

    context.startElement({
        
        item: items,
        element: element,
        childElements: {
            "Row": {
                initializer: ScalarExpressionListTypeFactory,
                setter: (value)=> { items.push(value); }
            },
        },
    });
}
function ParallelismTypeActivationFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ParallelismTypeActivation;
    item.Type = parallelismTypeActivationTypeEnum(element.attributes.Type);

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object = value; }
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
function ParallelismTypeBrickRoutingFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ParallelismTypeBrickRouting;


    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "Object": {
                initializer: ObjectTypeFactory,
                setter: (value)=> { item.Object = value; }
            },
            "FragmentIdColumn": {
                initializer: SingleColumnReferenceTypeFactory,
                setter: (value)=> { item.FragmentIdColumn = value; }
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
function ShowPlanXMLFactory(context: ParserContext, element: InputElement) {
    const item = <any>element.attributes as ShowPlanXML;
    item.ClusteredMode = bool(element.attributes.ClusteredMode);

    context.startElement({
        
        item: item,
        element: element,
        childElements: {
            "BatchSequence": {
                initializer: BatchSequenceFactory,
                setter: (value)=> { item.BatchSequence = value; }
            },
        },
        finalize: (self, context) => {
        }
    });
}
export interface BaseStmtInfoType {
    StatementCompId?: number;
    StatementEstRows?: number;
    StatementId?: number;
    QueryCompilationReplay?: number;
    StatementOptmLevel?: string;
    StatementOptmEarlyAbortReason?: any;
    CardinalityEstimationModelVersion?: string;
    StatementSubTreeCost?: number;
    StatementText?: string;
    StatementType?: string;
    TemplatePlanGuideDB?: string;
    TemplatePlanGuideName?: string;
    PlanGuideDB?: string;
    PlanGuideName?: string;
    ParameterizedText?: string;
    ParameterizedPlanHandle?: string;
    QueryHash?: string;
    QueryPlanHash?: string;
    RetrievedFromCache?: string;
    StatementSqlHandle?: string;
    DatabaseContextSettingsId?: number;
    ParentObjectId?: number;
    BatchSqlHandle?: string;
    StatementParameterizationType?: number;
    SecurityPolicyApplied?: boolean;
    BatchModeOnRowStoreUsed?: boolean;
    QueryStoreStatementHintId?: number;
    QueryStoreStatementHintText?: string;
    QueryStoreStatementHintSource?: string;
    ContainsLedgerTables?: boolean;
    StatementSetOptions?: SetOptionsType;
}

export interface RelOpBaseType {
    DefinedValues?: DefinedValuesListType;
    InternalInfo?: InternalInfoType;
}

export interface RowsetType extends RelOpBaseType {
    Object: ObjectType[];
}

export interface SortType extends RelOpBaseType {
    Distinct?: boolean;
    OrderBy?: OrderByType;
    PartitionId?: SingleColumnReferenceType;
    RelOp?: RelOpType;
}

export interface ConcatType extends RelOpBaseType {
    RelOp: RelOpType[];
}

export interface RemoteType extends RelOpBaseType {
    RemoteDestination?: string;
    RemoteSource?: string;
    RemoteObject?: string;
}

export interface RemoteQueryType extends RemoteType {
    RemoteQuery?: string;
}

export interface ScalarExpressionType {
    ScalarOperator?: ScalarType;
}

export interface ExternalDistributedComputationType {
    EdcShowplanXml?: string;
    StmtSimple?: StmtSimpleType;
}

export interface StmtBlockType {
    ExternalDistributedComputation?: ExternalDistributedComputationType;
    StmtSimple?: StmtSimpleType;
    StmtCond?: StmtCondType;
    StmtCursor?: StmtCursorType;
    StmtReceive?: StmtReceiveType;
    StmtUseDb?: StmtUseDbType;
}

export interface StmtSimpleType extends BaseStmtInfoType {
    Dispatcher?: DispatcherType;
    QueryPlan?: QueryPlanType;
    UDF: FunctionType[];
    StoredProc?: FunctionType;
}

export interface StmtUseDbType extends BaseStmtInfoType {
    Database?: string;
}

export interface StmtCondType extends BaseStmtInfoType {
    Condition?: StmtCondTypeCondition;
    Then?: StmtCondTypeThen;
    Else?: StmtCondTypeElse;
}

export interface StmtCursorType extends BaseStmtInfoType {
    CursorPlan?: CursorPlanType;
}

export interface StmtReceiveType extends BaseStmtInfoType {
    ReceivePlan?: ReceivePlanType;
}

export interface FunctionType {
    ProcName?: string;
    IsNativelyCompiled?: boolean;
    Statements?: StmtBlockType;
}

export interface CursorPlanType {
    CursorName?: string;
    CursorActualType?: any;
    CursorRequestedType?: any;
    CursorConcurrency?: any;
    ForwardOnly?: boolean;
    Operation: CursorPlanTypeOperation[];
}

export declare type ReceivePlanType = ReceivePlanTypeOperation[];
export interface ColumnReferenceType {
    Server?: string;
    Database?: string;
    Schema?: string;
    Table?: string;
    Alias?: string;
    Column?: string;
    ComputedColumn?: boolean;
    ParameterDataType?: string;
    ParameterCompiledValue?: string;
    ParameterRuntimeValue?: string;
    ScalarOperator?: ScalarType;
    InternalInfo?: InternalInfoType;
}

export interface SingleColumnReferenceType {
    ColumnReference?: ColumnReferenceType;
}

export declare type ColumnReferenceListType = ColumnReferenceType[];
export interface ScanRangeType {
    ScanType?: any;
    RangeColumns?: ColumnReferenceListType;
    RangeExpressions?: ScalarExpressionListType;
}

export interface SeekPredicateType {
    Prefix?: ScanRangeType;
    StartRange?: ScanRangeType;
    EndRange?: ScanRangeType;
    IsNotNull?: SingleColumnReferenceType;
}

export declare type SeekPredicateNewType = SeekPredicateType[];
export declare type SeekPredicatePartType = SeekPredicateNewType[];
export interface SeekPredicatesType {
    SeekPredicate: SeekPredicateType[];
    SeekPredicateNew: SeekPredicateNewType[];
    SeekPredicatePart: SeekPredicatePartType[];
}

export interface ObjectType {
    Server?: string;
    Database?: string;
    Schema?: string;
    Table?: string;
    Index?: string;
    Filtered?: boolean;
    OnlineInbuildIndex?: number;
    OnlineIndexBuildMappingIndex?: number;
    Alias?: string;
    TableReferenceId?: number;
    IndexKind?: any;
    CloneAccessScope?: any;
    Storage?: any;
    GraphWorkTableType?: number;
    GraphWorkTableIdentifier?: number;
}

export declare type OrderByType = OrderByTypeOrderByColumn[];
export declare type DefinedValuesListType = DefinedValuesListTypeDefinedValue[];
export interface SpillToTempDbType {
    SpillLevel?: number;
    SpilledThreadCount?: number;
}

export interface SortSpillDetailsType {
    GrantedMemoryKb?: number;
    UsedMemoryKb?: number;
    WritesToTempDb?: number;
    ReadsFromTempDb?: number;
}

export interface HashSpillDetailsType {
    GrantedMemoryKb?: number;
    UsedMemoryKb?: number;
    WritesToTempDb?: number;
    ReadsFromTempDb?: number;
}

export interface ExchangeSpillDetailsType {
    WritesToTempDb?: number;
}

export interface WaitWarningType {
    WaitType?: any;
    WaitTime?: number;
}

export interface WaitStatType {
    WaitType?: string;
    WaitTimeMs?: number;
    WaitCount?: number;
}

export declare type WaitStatListType = WaitStatType[];
export interface QueryExecTimeType {
    CpuTime?: number;
    ElapsedTime?: number;
    UdfCpuTime?: number;
    UdfElapsedTime?: number;
}

export interface AffectingConvertWarningType {
    ConvertIssue?: any;
    Expression?: string;
}

export interface WarningsType {
    NoJoinPredicate?: boolean;
    SpatialGuess?: boolean;
    UnmatchedIndexes?: boolean;
    FullUpdateForOnlineIndexBuild?: boolean;
    SpillOccurred?: SpillOccurredType;
    ColumnsWithNoStatistics?: ColumnReferenceListType;
    ColumnsWithStaleStatistics?: ColumnReferenceListType;
    SpillToTempDb: SpillToTempDbType[];
    Wait: WaitWarningType[];
    PlanAffectingConvert: AffectingConvertWarningType[];
    SortSpillDetails: SortSpillDetailsType[];
    HashSpillDetails: HashSpillDetailsType[];
    ExchangeSpillDetails: ExchangeSpillDetailsType[];
    MemoryGrantWarning?: MemoryGrantWarningInfo;
}

export interface SpillOccurredType {
    Detail?: boolean;
}

export interface MemoryFractionsType {
    Input?: number;
    Output?: number;
}

export interface MemoryGrantType {
    SerialRequiredMemory?: number;
    SerialDesiredMemory?: number;
    RequiredMemory?: number;
    DesiredMemory?: number;
    RequestedMemory?: number;
    GrantWaitTime?: number;
    GrantedMemory?: number;
    MaxUsedMemory?: number;
    MaxQueryMemory?: number;
    LastRequestedMemory?: number;
    IsMemoryGrantFeedbackAdjusted?: any;
}

export interface MemoryGrantWarningInfo {
    GrantWarningKind?: any;
    RequestedMemory?: number;
    GrantedMemory?: number;
    MaxUsedMemory?: number;
}

export interface TraceFlagType {
    Value?: number;
    Scope?: any;
}

export interface TraceFlagListType {
    IsCompileTime?: boolean;
    TraceFlag: TraceFlagType[];
}

export interface OptimizerHardwareDependentPropertiesType {
    EstimatedAvailableMemoryGrant?: number;
    EstimatedPagesCached?: number;
    EstimatedAvailableDegreeOfParallelism?: number;
    MaxCompileMemory?: number;
}

export interface StatsInfoType {
    Database?: string;
    Database?: string;
    Schema?: string;
    Table?: string;
    Statistics?: string;
    ModificationCount?: number;
    SamplingPercent?: number;
    LastUpdate?: string;
}

export declare type OptimizerStatsUsageType = StatsInfoType[];
export declare type RunTimeInformationType = RunTimeInformationTypeRunTimeCountersPerThread[];
export interface RunTimePartitionSummaryType {
    PartitionsAccessed?: RunTimePartitionSummaryTypePartitionsAccessed;
}

export declare type IndexedViewInfoType = ObjectType[];
export interface RollupInfoType {
    HighestLevel?: number;
    RollupLevel: RollupLevelType[];
}

export interface RollupLevelType {
    Level?: number;
}

export interface StarJoinInfoType {
    Root?: boolean;
    OperationType?: any;
}

export interface InternalInfoType {
}

export interface OptimizationReplayType {
    Script?: string;
}

export interface ThreadStatType {
    Branches?: number;
    UsedThreads?: number;
    ThreadReservation: ThreadReservationType[];
}

export interface ThreadReservationType {
    NodeId?: number;
    ReservedThreads?: number;
}

export declare type MissingIndexesType = MissingIndexGroupType[];
export interface MissingIndexGroupType {
    Impact?: number;
    MissingIndex: MissingIndexType[];
}

export interface MissingIndexType {
    Database?: string;
    Schema?: string;
    Table?: string;
    ColumnGroup: ColumnGroupType[];
}

export interface ColumnGroupType {
    Usage?: any;
    Column: ColumnType[];
}

export interface ColumnType {
    Name?: string;
    ColumnId?: number;
}

export interface QueryPlanType {
    DegreeOfParallelism?: number;
    EffectiveDegreeOfParallelism?: number;
    NonParallelPlanReason?: string;
    DOPFeedbackAdjusted?: any;
    MemoryGrant?: number;
    CachedPlanSize?: number;
    CompileTime?: number;
    CompileCPU?: number;
    CompileMemory?: number;
    UsePlan?: boolean;
    ContainsInterleavedExecutionCandidates?: boolean;
    ContainsInlineScalarTsqlUdfs?: boolean;
    QueryVariantID?: number;
    DispatcherPlanHandle?: string;
    ExclusiveProfileTimeActive?: boolean;
    InternalInfo?: InternalInfoType;
    OptimizationReplay?: OptimizationReplayType;
    ThreadStat?: ThreadStatType;
    MissingIndexes?: MissingIndexesType;
    GuessedSelectivity?: GuessedSelectivityType;
    UnmatchedIndexes?: UnmatchedIndexesType;
    Warnings?: WarningsType;
    MemoryGrantInfo?: MemoryGrantType;
    OptimizerHardwareDependentProperties?: OptimizerHardwareDependentPropertiesType;
    OptimizerStatsUsage?: OptimizerStatsUsageType;
    TraceFlags: TraceFlagListType[];
    WaitStats?: WaitStatListType;
    QueryTimeStats?: QueryExecTimeType;
    RelOp?: RelOpType;
    ParameterList?: ColumnReferenceListType;
}

export interface GuessedSelectivityType {
    Spatial?: ObjectType;
}

export interface UnmatchedIndexesType {
    Parameterization?: ParameterizationType;
}

export declare type ParameterizationType = ObjectType[];
export interface RelOpType {
    AvgRowSize?: number;
    EstimateCPU?: number;
    EstimateIO?: number;
    EstimateRebinds?: number;
    EstimateRewinds?: number;
    EstimatedExecutionMode?: any;
    GroupExecuted?: boolean;
    EstimateRows?: number;
    EstimateRowsWithoutRowGoal?: number;
    EstimatedRowsRead?: number;
    LogicalOp?: any;
    NodeId?: number;
    Parallel?: boolean;
    RemoteDataAccess?: boolean;
    Partitioned?: boolean;
    PhysicalOp?: any;
    IsAdaptive?: boolean;
    AdaptiveThresholdRows?: number;
    EstimatedTotalSubtreeCost?: number;
    TableCardinality?: number;
    StatsCollectionId?: number;
    EstimatedJoinType?: any;
    HyperScaleOptimizedQueryProcessing?: string;
    HyperScaleOptimizedQueryProcessingUnusedReason?: string;
    PDWAccumulativeCost?: number;
    AdaptiveJoin?: AdaptiveJoinType;
    Apply?: JoinType;
    Assert?: FilterType;
    BatchHashTableBuild?: BatchHashTableBuildType;
    Bitmap?: BitmapType;
    Collapse?: CollapseType;
    ComputeScalar?: ComputeScalarType;
    Concat?: ConcatType;
    ConstantScan?: ConstantScanType;
    ConstTableGet?: GetType;
    CreateIndex?: CreateIndexType;
    Delete?: DMLOpType;
    DeletedScan?: RowsetType;
    Extension?: UDXType;
    ExternalSelect?: ExternalSelectType;
    ExtExtractScan?: RemoteType;
    Filter?: FilterType;
    ForeignKeyReferencesCheck?: ForeignKeyReferencesCheckType;
    GbAgg?: GbAggType;
    GbApply?: GbApplyType;
    Generic?: GenericType;
    Get?: GetType;
    Hash?: HashType;
    IndexScan?: IndexScanType;
    InsertedScan?: RowsetType;
    Insert?: DMLOpType;
    Join?: JoinType;
    LocalCube?: LocalCubeType;
    LogRowScan?: RelOpBaseType;
    Merge?: MergeType;
    MergeInterval?: SimpleIteratorOneChildType;
    Move?: MoveType;
    NestedLoops?: NestedLoopsType;
    OnlineIndex?: CreateIndexType;
    Parallelism?: ParallelismType;
    ParameterTableScan?: RelOpBaseType;
    PrintDataflow?: RelOpBaseType;
    Project?: ProjectType;
    Put?: PutType;
    RemoteFetch?: RemoteFetchType;
    RemoteModify?: RemoteModifyType;
    RemoteQuery?: RemoteQueryType;
    RemoteRange?: RemoteRangeType;
    RemoteScan?: RemoteType;
    RowCountSpool?: SpoolType;
    ScalarInsert?: ScalarInsertType;
    Segment?: SegmentType;
    Sequence?: SequenceType;
    SequenceProject?: ComputeScalarType;
    SimpleUpdate?: SimpleUpdateType;
    Sort?: SortType;
    Split?: SplitType;
    Spool?: SpoolType;
    StreamAggregate?: StreamAggregateType;
    Switch?: SwitchType;
    TableScan?: TableScanType;
    TableValuedFunction?: TableValuedFunctionType;
    Top?: TopType;
    TopSort?: TopSortType;
    Update?: UpdateType;
    Update?: UpdateType;
    Union?: ConcatType;
    UnionAll?: ConcatType;
    WindowSpool?: WindowType;
    WindowAggregate?: WindowAggregateType;
    XcsScan?: XcsScanType;
    OutputList?: ColumnReferenceListType;
    Warnings?: WarningsType;
    MemoryFractions?: MemoryFractionsType;
    RunTimeInformation?: RunTimeInformationType;
    RunTimePartitionSummary?: RunTimePartitionSummaryType;
    InternalInfo?: InternalInfoType;
}

export interface AdaptiveJoinType extends RelOpBaseType {
    BitmapCreator?: boolean;
    Optimized?: boolean;
    WithOrderedPrefetch?: boolean;
    WithUnorderedPrefetch?: boolean;
    HashKeysBuild?: ColumnReferenceListType;
    HashKeysProbe?: ColumnReferenceListType;
    BuildResidual?: ScalarExpressionType;
    ProbeResidual?: ScalarExpressionType;
    StarJoinInfo?: StarJoinInfoType;
    Predicate?: ScalarExpressionType;
    PassThru?: ScalarExpressionType;
    OuterReferences?: ColumnReferenceListType;
    PartitionId?: SingleColumnReferenceType;
    RelOp: RelOpType[];
}

export interface ForeignKeyReferencesCheckType extends RelOpBaseType {
    ForeignKeyReferencesCount?: number;
    NoMatchingIndexCount?: number;
    PartialMatchingIndexCount?: number;
    RelOp?: RelOpType;
    ForeignKeyReferenceCheck: ForeignKeyReferenceCheckType[];
}

export interface ForeignKeyReferenceCheckType {
    IndexScan?: IndexScanType;
}

export interface SimpleIteratorOneChildType extends RelOpBaseType {
    RelOp?: RelOpType;
}

export interface FilterType extends RelOpBaseType {
    StartupExpression?: boolean;
    RelOp?: RelOpType;
    Predicate?: ScalarExpressionType;
}

export interface ConstantScanType extends RelOpBaseType {
    Values?: ConstantScanTypeValues;
}

export interface TableScanType extends RowsetType {
    Ordered?: boolean;
    ForcedIndex?: boolean;
    ForceScan?: boolean;
    NoExpandHint?: boolean;
    Storage?: any;
    Predicate?: ScalarExpressionType;
    PartitionId?: SingleColumnReferenceType;
    IndexedViewInfo?: IndexedViewInfoType;
}

export interface XcsScanType extends RowsetType {
    Ordered?: boolean;
    ForcedIndex?: boolean;
    ForceScan?: boolean;
    NoExpandHint?: boolean;
    Storage?: any;
    Predicate?: ScalarExpressionType;
    PartitionId?: SingleColumnReferenceType;
    IndexedViewInfo?: IndexedViewInfoType;
    RelOp?: RelOpType;
}

export interface IndexScanType extends RowsetType {
    Lookup?: boolean;
    Ordered?: boolean;
    ScanDirection?: any;
    ForcedIndex?: boolean;
    ForceSeek?: boolean;
    ForceSeekColumnCount?: number;
    ForceScan?: boolean;
    NoExpandHint?: boolean;
    Storage?: any;
    DynamicSeek?: boolean;
    SBSFileUrl?: string;
    SeekPredicates?: SeekPredicatesType;
    Predicate?: ScalarExpressionType;
    PartitionId?: SingleColumnReferenceType;
    IndexedViewInfo?: IndexedViewInfoType;
}

export interface TableValuedFunctionType extends RelOpBaseType {
    Object?: ObjectType;
    Predicate?: ScalarExpressionType;
    RelOp?: RelOpType;
    ParameterList?: ScalarExpressionListType;
}

export interface HashType extends RelOpBaseType {
    BitmapCreator?: boolean;
    HashKeysBuild?: ColumnReferenceListType;
    HashKeysProbe?: ColumnReferenceListType;
    BuildResidual?: ScalarExpressionType;
    ProbeResidual?: ScalarExpressionType;
    StarJoinInfo?: StarJoinInfoType;
    RelOp: RelOpType[];
}

export interface ComputeScalarType extends RelOpBaseType {
    ComputeSequence?: boolean;
    RelOp?: RelOpType;
}

export interface ParallelismType extends RelOpBaseType {
    PartitioningType?: any;
    Remoting?: boolean;
    LocalParallelism?: boolean;
    InRow?: boolean;
    PartitionColumns?: ColumnReferenceListType;
    OrderBy?: OrderByType;
    HashKeys?: ColumnReferenceListType;
    ProbeColumn?: SingleColumnReferenceType;
    Predicate?: ScalarExpressionType;
    Activation?: ParallelismTypeActivation;
    BrickRouting?: ParallelismTypeBrickRouting;
    RelOp?: RelOpType;
}

export interface StreamAggregateType extends RelOpBaseType {
    GroupBy?: ColumnReferenceListType;
    RollupInfo?: RollupInfoType;
    RelOp?: RelOpType;
}

export interface BitmapType extends RelOpBaseType {
    HashKeys?: ColumnReferenceListType;
    RelOp?: RelOpType;
}

export interface CollapseType extends RelOpBaseType {
    GroupBy?: ColumnReferenceListType;
    RelOp?: RelOpType;
}

export interface SwitchType extends ConcatType {
    Predicate?: ScalarExpressionType;
}

export interface MergeType extends RelOpBaseType {
    ManyToMany?: boolean;
    InnerSideJoinColumns?: ColumnReferenceListType;
    OuterSideJoinColumns?: ColumnReferenceListType;
    Residual?: ScalarExpressionType;
    PassThru?: ScalarExpressionType;
    StarJoinInfo?: StarJoinInfoType;
    RelOp: RelOpType[];
}

export interface NestedLoopsType extends RelOpBaseType {
    Optimized?: boolean;
    WithOrderedPrefetch?: boolean;
    WithUnorderedPrefetch?: boolean;
    Predicate?: ScalarExpressionType;
    PassThru?: ScalarExpressionType;
    OuterReferences?: ColumnReferenceListType;
    PartitionId?: SingleColumnReferenceType;
    ProbeColumn?: SingleColumnReferenceType;
    StarJoinInfo?: StarJoinInfoType;
    RelOp: RelOpType[];
}

export interface SegmentType extends RelOpBaseType {
    GroupBy?: ColumnReferenceListType;
    SegmentColumn?: SingleColumnReferenceType;
    RelOp?: RelOpType;
}

export interface SequenceType extends RelOpBaseType {
    IsGraphDBTransitiveClosure?: boolean;
    GraphSequenceIdentifier?: number;
    RelOp: RelOpType[];
}

export interface SplitType extends RelOpBaseType {
    ActionColumn?: SingleColumnReferenceType;
    RelOp?: RelOpType;
}

export interface TopType extends RelOpBaseType {
    RowCount?: boolean;
    Rows?: number;
    IsPercent?: boolean;
    WithTies?: boolean;
    TopLocation?: string;
    TieColumns?: ColumnReferenceListType;
    OffsetExpression?: ScalarExpressionType;
    TopExpression?: ScalarExpressionType;
    RelOp?: RelOpType;
}

export interface UDXType extends RelOpBaseType {
    UDXName?: string;
    UsedUDXColumns?: ColumnReferenceListType;
    RelOp?: RelOpType;
}

export interface WindowType extends RelOpBaseType {
    RelOp?: RelOpType;
}

export interface WindowAggregateType extends RelOpBaseType {
    RelOp?: RelOpType;
}

export interface PutType extends RemoteQueryType {
    IsExternallyComputed?: boolean;
    ShuffleType?: string;
    ShuffleColumn?: string;
    RelOp?: RelOpType;
}

export interface SimpleUpdateType extends RowsetType {
    DMLRequestSort?: boolean;
    SeekPredicate?: SeekPredicateType;
    SeekPredicateNew?: SeekPredicateNewType;
    SetPredicate?: ScalarExpressionType;
}

export interface SetPredicateElementType extends ScalarExpressionType {
    SetPredicateType?: any;
}

export interface UpdateType extends RowsetType {
    WithOrderedPrefetch?: boolean;
    WithUnorderedPrefetch?: boolean;
    DMLRequestSort?: boolean;
    SetPredicate: SetPredicateElementType[];
    ProbeColumn?: SingleColumnReferenceType;
    ActionColumn?: SingleColumnReferenceType;
    OriginalActionColumn?: SingleColumnReferenceType;
    AssignmentMap?: AssignmentMapType;
    SourceTable?: ParameterizationType;
    TargetTable?: ParameterizationType;
    RelOp?: RelOpType;
}

export interface CreateIndexType extends RowsetType {
    RelOp?: RelOpType;
}

export interface SpoolType extends RelOpBaseType {
    Stack?: boolean;
    PrimaryNodeId?: number;
    SeekPredicate?: SeekPredicateType;
    SeekPredicateNew?: SeekPredicateNewType;
    RelOp?: RelOpType;
}

export interface BatchHashTableBuildType extends RelOpBaseType {
    BitmapCreator?: boolean;
    RelOp?: RelOpType;
}

export interface ScalarInsertType extends RowsetType {
    DMLRequestSort?: boolean;
    SetPredicate?: ScalarExpressionType;
}

export interface TopSortType extends SortType {
    Rows?: number;
    WithTies?: boolean;
}

export interface RemoteRangeType extends RemoteType {
    SeekPredicates?: SeekPredicatesType;
}

export interface RemoteFetchType extends RemoteType {
    RelOp?: RelOpType;
}

export interface RemoteModifyType extends RemoteType {
    SetPredicate?: ScalarExpressionType;
    RelOp?: RelOpType;
}

export interface GenericType extends RelOpBaseType {
    RelOp: RelOpType[];
}

export interface ResourceEstimateType {
    NodeCount?: number;
    Dop?: number;
    MemoryInBytes?: number;
    DiskWrittenInBytes?: number;
    Scalable?: boolean;
}

export interface MoveType extends RelOpBaseType {
    MoveType?: string;
    DistributionType?: string;
    IsDistributed?: boolean;
    IsExternal?: boolean;
    IsFull?: boolean;
    DistributionKey?: ColumnReferenceListType;
    ResourceEstimate?: ResourceEstimateType;
    RelOp: RelOpType[];
}

export interface ExternalSelectType extends RelOpBaseType {
    MaterializeOperation?: string;
    DistributionType?: string;
    IsDistributed?: boolean;
    IsExternal?: boolean;
    IsFull?: boolean;
    RelOp: RelOpType[];
}

export interface ProjectType extends RelOpBaseType {
    IsNoOp?: boolean;
    RelOp: RelOpType[];
}

export interface JoinType extends RelOpBaseType {
    Predicate: ScalarExpressionType[];
    Probe: SingleColumnReferenceType[];
    RelOp: RelOpType[];
}

export interface GbApplyType extends RelOpBaseType {
    JoinType?: string;
    AggType?: string;
    Predicate: ScalarExpressionType[];
    AggFunctions?: DefinedValuesListType;
    RelOp: RelOpType[];
}

export interface GbAggType extends RelOpBaseType {
    IsScalar?: boolean;
    AggType?: string;
    HintType?: string;
    GroupBy?: ColumnReferenceListType;
    AggFunctions?: DefinedValuesListType;
    RelOp: RelOpType[];
}

export interface GroupingSetReferenceType {
    Value?: string;
}

export declare type GroupingSetListType = GroupingSetReferenceType[];
export interface LocalCubeType extends RelOpBaseType {
    GroupBy?: ColumnReferenceListType;
    GroupingSets?: GroupingSetListType;
    RelOp: RelOpType[];
}

export interface DMLOpType extends RelOpBaseType {
    AssignmentMap?: AssignmentMapType;
    SourceTable?: ParameterizationType;
    TargetTable?: ParameterizationType;
    RelOp: RelOpType[];
}

export declare type AssignmentMapType = AssignType[];
export interface GetType extends RelOpBaseType {
    NumRows?: number;
    IsExternal?: boolean;
    IsDistributed?: boolean;
    IsHashDistributed?: boolean;
    IsReplicated?: boolean;
    IsRoundRobin?: boolean;
    Bookmarks?: ColumnReferenceListType;
    OutputColumns?: OutputColumnsType;
    GeneratedData?: ScalarExpressionListType;
    RelOp: RelOpType[];
}

export interface OutputColumnsType {
    DefinedValues?: DefinedValuesListType;
    Object: ObjectType[];
}

export interface ScalarType {
    ScalarString?: string;
    Aggregate?: AggregateType;
    Arithmetic?: ArithmeticType;
    Assign?: AssignType;
    Compare?: CompareType;
    Const?: ConstType;
    Convert?: ConvertType;
    Identifier?: IdentType;
    IF?: ConditionalType;
    Intrinsic?: IntrinsicType;
    Logical?: LogicalType;
    MultipleAssign?: MultAssignType;
    ScalarExpressionList?: ScalarExpressionListType;
    Sequence?: ScalarSequenceType;
    Subquery?: SubqueryType;
    UDTMethod?: UDTMethodType;
    UserDefinedAggregate?: UDAggregateType;
    UserDefinedFunction?: UDFType;
    InternalInfo?: InternalInfoType;
}

export declare type ScalarExpressionListType = ScalarType[];
export interface ConstType {
    ConstValue?: string;
}

export interface IdentType {
    Table?: string;
    ColumnReference?: ColumnReferenceType;
}

export interface CompareType {
    CompareOp?: any;
    ScalarOperator: ScalarType[];
}

export interface ConvertType {
    DataType?: string;
    Length?: number;
    Precision?: number;
    Scale?: number;
    StyleIndex?: number;
    Implicit?: boolean;
    Style?: ScalarExpressionType;
    ScalarOperator?: ScalarType;
}

export interface ArithmeticType {
    Operation?: any;
    ScalarOperator: ScalarType[];
}

export interface LogicalType {
    Operation?: any;
    ScalarOperator: ScalarType[];
}

export interface UDAggregateType {
    Distinct?: boolean;
    UDAggObject?: ObjectType;
    ScalarOperator: ScalarType[];
}

export interface AggregateType {
    AggType?: string;
    Distinct?: boolean;
    ScalarOperator: ScalarType[];
}

export interface AssignType {
    ColumnReference?: ColumnReferenceType;
    ScalarOperator?: ScalarType;
    SourceColumn: ColumnReferenceType[];
    TargetColumn: ColumnReferenceType[];
}

export declare type MultAssignType = AssignType[];
export interface ConditionalType {
    Condition?: ScalarExpressionType;
    Then?: ScalarExpressionType;
    Else?: ScalarExpressionType;
}

export interface IntrinsicType {
    FunctionName?: string;
    ScalarOperator: ScalarType[];
}

export interface ScalarSequenceType {
    FunctionName?: string;
}

export interface UDFType {
    FunctionName?: string;
    IsClrFunction?: boolean;
    ScalarOperator: ScalarType[];
    CLRFunction?: CLRFunctionType;
}

export interface UDTMethodType {
    CLRFunction?: CLRFunctionType;
    ScalarOperator: ScalarType[];
}

export interface CLRFunctionType {
    Assembly?: string;
    Class?: string;
    Method?: string;
}

export interface SubqueryType {
    Operation?: any;
    ScalarOperator?: ScalarType;
    RelOp?: RelOpType;
}

export declare type DispatcherType = ParameterSensitivePredicateType[];
export interface ParameterSensitivePredicateType {
    LowBoundary?: number;
    HighBoundary?: number;
    StatisticsInfo: StatsInfoType[];
    Predicate?: ScalarExpressionType;
}

export interface SetOptionsType {
    ANSI_NULLS?: any;
    ANSI_PADDING?: any;
    ANSI_WARNINGS?: any;
    ARITHABORT?: any;
    CONCAT_NULL_YIELDS_NULL?: any;
    NUMERIC_ROUNDABORT?: any;
    QUOTED_IDENTIFIER?: any;
}

export declare type BatchSequence = Batch[];
export declare type Batch = StmtBlockType[];
export interface StmtCondTypeCondition {
    QueryPlan?: QueryPlanType;
    UDF: FunctionType[];
}

export interface StmtCondTypeThen {
    Statements?: StmtBlockType;
}

export interface StmtCondTypeElse {
    Statements?: StmtBlockType;
}

export interface CursorPlanTypeOperation {
    OperationType?: any;
    Dispatcher?: DispatcherType;
    QueryPlan?: QueryPlanType;
    UDF: FunctionType[];
}

export interface ReceivePlanTypeOperation {
    OperationType?: any;
    QueryPlan?: QueryPlanType;
}

export interface OrderByTypeOrderByColumn {
    Ascending?: boolean;
    ColumnReference?: ColumnReferenceType;
}

export interface DefinedValuesListTypeDefinedValue {
    ValueVector?: DefinedValuesListTypeValueVector;
    ColumnReference?: ColumnReferenceType;
    ScalarOperator?: ScalarType;
}

export declare type DefinedValuesListTypeValueVector = ColumnReferenceType[];
export interface RunTimeInformationTypeRunTimeCountersPerThread {
    Thread?: number;
    BrickId?: number;
    ActualRebinds?: number;
    ActualRewinds?: number;
    ActualRows?: number;
    RowRequalifications?: number;
    ActualRowsRead?: number;
    Batches?: number;
    ActualEndOfScans?: number;
    ActualExecutions?: number;
    ActualExecutionMode?: any;
    TaskAddr?: number;
    SchedulerId?: number;
    FirstActiveTime?: number;
    LastActiveTime?: number;
    OpenTime?: number;
    FirstRowTime?: number;
    LastRowTime?: number;
    CloseTime?: number;
    ActualElapsedms?: number;
    ActualCPUms?: number;
    ActualScans?: number;
    ActualLogicalReads?: number;
    ActualPhysicalReads?: number;
    ActualPageServerReads?: number;
    ActualReadAheads?: number;
    ActualPageServerReadAheads?: number;
    ActualLobLogicalReads?: number;
    ActualLobPhysicalReads?: number;
    ActualLobPageServerReads?: number;
    ActualLobReadAheads?: number;
    ActualLobPageServerReadAheads?: number;
    SegmentReads?: number;
    SegmentSkips?: number;
    ActualLocallyAggregatedRows?: number;
    InputMemoryGrant?: number;
    OutputMemoryGrant?: number;
    UsedMemoryGrant?: number;
    IsInterleavedExecuted?: boolean;
    ActualJoinType?: any;
    HpcRowCount?: number;
    HpcKernelElapsedUs?: number;
    HpcHostToDeviceBytes?: number;
    HpcDeviceToHostBytes?: number;
    ActualPageServerPushedPageIDs?: number;
    ActualPageServerRowsReturned?: number;
    ActualPageServerRowsRead?: number;
    ActualPageServerPushedReads?: number;
}

export interface RunTimePartitionSummaryTypePartitionsAccessed {
    PartitionCount?: number;
    PartitionRange: RunTimePartitionSummaryTypePartitionRange[];
}

export interface RunTimePartitionSummaryTypePartitionRange {
    Start?: number;
    End?: number;
}

export declare type ConstantScanTypeValues = ScalarExpressionListType[];
export interface ParallelismTypeActivation {
    Type?: any;
    FragmentElimination?: any;
    Object?: ObjectType;
}

export interface ParallelismTypeBrickRouting {
    Object?: ObjectType;
    FragmentIdColumn?: SingleColumnReferenceType;
}

export interface ShowPlanXML {
    Version?: string;
    Build?: string;
    ClusteredMode?: boolean;
    BatchSequence?: BatchSequence;
}


