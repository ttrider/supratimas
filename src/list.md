BaseStmtInfoType
StmtSimpleType
StmtUseDbType
StmtCondType
StmtCursorType
StmtReceiveType
FunctionType
RelOpType
StmtCondTypeThen
StmtCondTypeElse
CursorPlanTypeOperation
ReceivePlanTypeOperation
BaseStmtInfoType
RelOpBaseType
RowsetType
SortType
ConcatType
RemoteType
RemoteQueryType
ScalarExpressionType
StmtBlockType
StmtSimpleType
StmtUseDbType
StmtCondType
StmtCursorType
StmtReceiveType
FunctionType
CursorPlanType
ReceivePlanType
ColumnReferenceType
SingleColumnReferenceType
ColumnReferenceListType
ScanRangeType
SeekPredicateType
SeekPredicateNewType
SeekPredicatePartType
SeekPredicatesType
ObjectType
OrderByType
DefinedValuesListType
SpillToTempDbType
SortSpillDetailsType
HashSpillDetailsType
WaitWarningType
WaitStatType
WaitStatListType
QueryExecTimeType
AffectingConvertWarningType
WarningsType
MemoryFractionsType
MemoryGrantType
MemoryGrantWarningInfo
TraceFlagType
TraceFlagListType
OptimizerHardwareDependentPropertiesType
StatsInfoType
OptimizerStatsUsageType
RunTimeInformationType
RunTimePartitionSummaryType
IndexedViewInfoType
RollupInfoType
RollupLevelType
StarJoinInfoType
InternalInfoType
ThreadStatType
ThreadReservationType
MissingIndexesType
MissingIndexGroupType
MissingIndexType
ColumnGroupType
ColumnType
QueryPlanType
GuessedSelectivityType
UnmatchedIndexesType
ParameterizationType
RelOpType
AdaptiveJoinType
ForeignKeyReferencesCheckType
ForeignKeyReferenceCheckType
SimpleIteratorOneChildType
FilterType
ConstantScanType
TableScanType
IndexScanType
TableValuedFunctionType
HashType
ComputeScalarType
ParallelismType
StreamAggregateType
BitmapType
CollapseType
SwitchType
MergeType
NestedLoopsType
SegmentType
SequenceType
SplitType
TopType
UDXType
WindowType
WindowAggregateType
PutType
SimpleUpdateType
SetPredicateElementType
UpdateType
CreateIndexType
SpoolType
BatchHashTableBuildType
ScalarInsertType
TopSortType
RemoteRangeType
RemoteFetchType
RemoteModifyType
GenericType
ScalarType
ScalarExpressionListType
ConstType
IdentType
CompareType
ConvertType
ArithmeticType
LogicalType
UDAggregateType
AggregateType
AssignType
MultAssignType
ConditionalType
IntrinsicType
ScalarSequenceType
UDFType
UDTMethodType
CLRFunctionType
SubqueryType
SetOptionsType
BatchSequence
Batch
StmtCondTypeCondition
StmtCondTypeThen
StmtCondTypeElse
CursorPlanTypeOperation
ReceivePlanTypeOperation
OrderByTypeOrderByColumn
DefinedValuesListTypeDefinedValue
DefinedValuesListTypeValueVector
RunTimeInformationTypeRunTimeCountersPerThread
RunTimePartitionSummaryTypePartitionsAccessed
RunTimePartitionSummaryTypePartitionRange
ConstantScanTypeValues
ParallelismTypeActivation
ParallelismTypeBrickRouting
ShowPlanXML

# Classes by reference
- BaseStmtInfoType - [0]

- StmtSimpleType - [1]

- StmtUseDbType - [1]

- StmtCondType - [1]

- StmtCursorType - [1]

- StmtReceiveType - [1]

- FunctionType - [4]

- RelOpType - [34]

- StmtCondTypeThen - [1]

- StmtCondTypeElse - [1]

- CursorPlanTypeOperation - [1]

- ReceivePlanTypeOperation - [1]


# Classes

## BaseStmtInfoType
statement node
- StatementCompId
- StatementEstRows
- StatementId
- StatementOptmLevel
- StatementOptmEarlyAbortReason
- CardinalityEstimationModelVersion
- StatementSubTreeCost
- StatementText
- StatementType (title) (subTitle)
- TemplatePlanGuideDB
- TemplatePlanGuideName
- PlanGuideDB
- PlanGuideName
- ParameterizedText
- ParameterizedPlanHandle
- QueryHash
- QueryPlanHash
- RetrievedFromCache
- StatementSqlHandle
- DatabaseContextSettingsId
- ParentObjectId
- BatchSqlHandle
- StatementParameterizationType
- SecurityPolicyApplied
- StatementSetOptions (obj)

## RelOpBaseType

- DefinedValues (obj)
- InternalInfo (obj)

## RowsetType (RelOpBaseType)

- Object (obj[])

## SortType (RelOpBaseType)

- Distinct
- OrderBy (obj)
- PartitionId (obj)
- RelOp (obj)

## ConcatType (RelOpBaseType)

- RelOp (obj[])

## RemoteType (RelOpBaseType)

- RemoteDestination
- RemoteSource
- RemoteObject

## RemoteQueryType (RemoteType)

- RemoteQuery

## ScalarExpressionType

- ScalarOperator (obj)

## StmtBlockType

- StmtSimple (obj)
- StmtCond (obj)
- StmtCursor (obj)
- StmtReceive (obj)
- StmtUseDb (obj)

## StmtSimpleType (BaseStmtInfoType)
statement node
- QueryPlan (obj)
- UDF (obj[])
- StoredProc (obj)

## StmtUseDbType (BaseStmtInfoType)
statement node
- Database (subTitle)

## StmtCondType (BaseStmtInfoType)
statement node
- Condition (obj)
- Then (obj)
- Else (obj)

## StmtCursorType (BaseStmtInfoType)
statement node
- CursorPlan (obj)

## StmtReceiveType (BaseStmtInfoType)
statement node
- ReceivePlan (obj)

## FunctionType
node
- ProcName (subTitle)
- IsNativelyCompiled
- Statements (obj)

## CursorPlanType

- CursorName (subTitle)
- CursorActualType
- CursorRequestedType
- CursorConcurrency
- ForwardOnly
- Operation (obj[])

## ReceivePlanType

- Operation (obj[])

## ColumnReferenceType

- Server
- Database
- Schema
- Table
- Alias
- Column
- ComputedColumn
- ParameterDataType
- ParameterCompiledValue
- ParameterRuntimeValue
- ScalarOperator (obj)
- InternalInfo (obj)

## SingleColumnReferenceType

- ColumnReference (obj)

## ColumnReferenceListType

- ColumnReference (obj[])

## ScanRangeType

- ScanType
- RangeColumns (obj)
- RangeExpressions (obj)

## SeekPredicateType

- Prefix (obj)
- StartRange (obj)
- EndRange (obj)
- IsNotNull (obj)

## SeekPredicateNewType

- SeekKeys (obj[])

## SeekPredicatePartType

- SeekPredicateNew (obj[])

## SeekPredicatesType

- SeekPredicate (obj[])
- SeekPredicateNew (obj[])
- SeekPredicatePart (obj[])

## ObjectType

- Server
- Database
- Schema
- Table
- Index
- Filtered
- Alias
- TableReferenceId
- IndexKind
- CloneAccessScope
- Storage

## OrderByType

- OrderByColumn (obj[])

## DefinedValuesListType

- DefinedValue (obj[])

## SpillToTempDbType

- SpillLevel
- SpilledThreadCount

## SortSpillDetailsType

- GrantedMemoryKb
- UsedMemoryKb
- WritesToTempDb
- ReadsFromTempDb

## HashSpillDetailsType

- GrantedMemoryKb
- UsedMemoryKb
- WritesToTempDb
- ReadsFromTempDb

## WaitWarningType

- WaitType
- WaitTime

## WaitStatType

- WaitType
- WaitTimeMs
- WaitCount

## WaitStatListType

- Wait (obj[])

## QueryExecTimeType

- CpuTime
- ElapsedTime

## AffectingConvertWarningType

- ConvertIssue
- Expression

## WarningsType

- NoJoinPredicate
- SpatialGuess
- UnmatchedIndexes
- FullUpdateForOnlineIndexBuild
- ColumnsWithNoStatistics (obj)
- SpillToTempDb (obj[])
- Wait (obj[])
- PlanAffectingConvert (obj[])
- SortSpillDetails (obj[])
- HashSpillDetails (obj[])
- MemoryGrantWarning (obj)

## MemoryFractionsType

- Input
- Output

## MemoryGrantType

- SerialRequiredMemory
- SerialDesiredMemory
- RequiredMemory
- DesiredMemory
- RequestedMemory
- GrantWaitTime
- GrantedMemory
- MaxUsedMemory
- MaxQueryMemory

## MemoryGrantWarningInfo

- GrantWarningKind
- RequestedMemory
- GrantedMemory
- MaxUsedMemory

## TraceFlagType

- Value
- Scope

## TraceFlagListType

- IsCompileTime
- TraceFlag (obj[])

## OptimizerHardwareDependentPropertiesType

- EstimatedAvailableMemoryGrant
- EstimatedPagesCached
- EstimatedAvailableDegreeOfParallelism
- MaxCompileMemory

## StatsInfoType

- Database
- Schema
- Table
- Statistics
- ModificationCount
- SamplingPercent
- LastUpdate

## OptimizerStatsUsageType

- StatisticsInfo (obj[])

## RunTimeInformationType

- RunTimeCountersPerThread (obj[])

## RunTimePartitionSummaryType

- PartitionsAccessed (obj)

## IndexedViewInfoType

- Object (obj[])

## RollupInfoType

- HighestLevel
- RollupLevel (obj[])

## RollupLevelType

- Level

## StarJoinInfoType

- Root
- OperationType

## InternalInfoType


## ThreadStatType

- Branches
- UsedThreads
- ThreadReservation (obj[])

## ThreadReservationType

- NodeId
- ReservedThreads

## MissingIndexesType

- MissingIndexGroup (obj[])

## MissingIndexGroupType

- Impact
- MissingIndex (obj[])

## MissingIndexType

- Database
- Schema
- Table
- ColumnGroup (obj[])

## ColumnGroupType

- Usage
- Column (obj[])

## ColumnType

- Name
- ColumnId

## QueryPlanType

- DegreeOfParallelism
- EffectiveDegreeOfParallelism
- NonParallelPlanReason
- MemoryGrant
- CachedPlanSize
- CompileTime
- CompileCPU
- CompileMemory
- UsePlan
- ContainsInterleavedExecutionCandidates
- InternalInfo (obj)
- ThreadStat (obj)
- MissingIndexes (obj)
- GuessedSelectivity (obj)
- UnmatchedIndexes (obj)
- Warnings (obj)
- MemoryGrantInfo (obj)
- OptimizerHardwareDependentProperties (obj)
- OptimizerStatsUsage (obj)
- TraceFlags (obj[])
- WaitStats (obj)
- QueryTimeStats (obj)
- RelOp (obj)
- ParameterList (obj)

## GuessedSelectivityType

- Spatial (obj)

## UnmatchedIndexesType

- Parameterization (obj)

## ParameterizationType

- Object (obj[])

## RelOpType
node
- AvgRowSize
- EstimateCPU
- EstimateIO
- EstimateRebinds
- EstimateRewinds
- EstimatedExecutionMode
- GroupExecuted
- EstimateRows
- EstimatedRowsRead
- LogicalOp (subTitle)
- NodeId
- Parallel
- RemoteDataAccess
- Partitioned
- PhysicalOp (title)
- IsAdaptive
- AdaptiveThresholdRows
- EstimatedTotalSubtreeCost
- StatsCollectionId
- EstimatedJoinType
- TableCardinality
- AdaptiveJoin (obj)
- Assert (obj)
- BatchHashTableBuild (obj)
- Bitmap (obj)
- Collapse (obj)
- ComputeScalar (obj)
- Concat (obj)
- ConstantScan (obj)
- CreateIndex (obj)
- DeletedScan (obj)
- Extension (obj)
- Filter (obj)
- ForeignKeyReferencesCheck (obj)
- Generic (obj)
- Hash (obj)
- IndexScan (obj)
- InsertedScan (obj)
- LogRowScan (obj)
- Merge (obj)
- MergeInterval (obj)
- NestedLoops (obj)
- OnlineIndex (obj)
- Parallelism (obj)
- ParameterTableScan (obj)
- PrintDataflow (obj)
- Put (obj)
- RemoteFetch (obj)
- RemoteModify (obj)
- RemoteQuery (obj)
- RemoteRange (obj)
- RemoteScan (obj)
- RowCountSpool (obj)
- ScalarInsert (obj)
- Segment (obj)
- Sequence (obj)
- SequenceProject (obj)
- SimpleUpdate (obj)
- Sort (obj)
- Split (obj)
- Spool (obj)
- StreamAggregate (obj)
- Switch (obj)
- TableScan (obj)
- TableValuedFunction (obj)
- Top (obj)
- TopSort (obj)
- Update (obj)
- WindowSpool (obj)
- WindowAggregate (obj)
- OutputList (obj)
- Warnings (obj)
- MemoryFractions (obj)
- RunTimeInformation (obj)
- RunTimePartitionSummary (obj)
- InternalInfo (obj)

## AdaptiveJoinType (RelOpBaseType)

- BitmapCreator
- Optimized
- HashKeysBuild (obj)
- HashKeysProbe (obj)
- BuildResidual (obj)
- ProbeResidual (obj)
- StarJoinInfo (obj)
- Predicate (obj)
- PassThru (obj)
- OuterReferences (obj)
- PartitionId (obj)
- RelOp (obj[])

## ForeignKeyReferencesCheckType (RelOpBaseType)

- ForeignKeyReferencesCount
- NoMatchingIndexCount
- PartialMatchingIndexCount
- RelOp (obj)
- ForeignKeyReferenceCheck (obj[])

## ForeignKeyReferenceCheckType

- IndexScan (obj)

## SimpleIteratorOneChildType (RelOpBaseType)

- RelOp (obj)

## FilterType (RelOpBaseType)

- StartupExpression
- RelOp (obj)
- Predicate (obj)

## ConstantScanType (RelOpBaseType)

- Values (obj)

## TableScanType (RowsetType)

- Ordered
- ForcedIndex
- ForceScan
- NoExpandHint
- Storage
- Predicate (obj)
- PartitionId (obj)
- IndexedViewInfo (obj)

## IndexScanType (RowsetType)

- Lookup
- Ordered
- ScanDirection
- ForcedIndex
- ForceSeek
- ForceSeekColumnCount
- ForceScan
- NoExpandHint
- Storage
- DynamicSeek
- SeekPredicates (obj)
- Predicate (obj)
- PartitionId (obj)
- IndexedViewInfo (obj)

## TableValuedFunctionType (RelOpBaseType)

- Object (obj)
- Predicate (obj)
- RelOp (obj)
- ParameterList (obj)

## HashType (RelOpBaseType)

- BitmapCreator
- HashKeysBuild (obj)
- HashKeysProbe (obj)
- BuildResidual (obj)
- ProbeResidual (obj)
- StarJoinInfo (obj)
- RelOp (obj[])

## ComputeScalarType (RelOpBaseType)

- ComputeSequence
- RelOp (obj)

## ParallelismType (RelOpBaseType)

- PartitioningType
- Remoting
- LocalParallelism
- InRow
- PartitionColumns (obj)
- OrderBy (obj)
- HashKeys (obj)
- ProbeColumn (obj)
- Predicate (obj)
- Activation (obj)
- BrickRouting (obj)
- RelOp (obj)

## StreamAggregateType (RelOpBaseType)

- GroupBy (obj)
- RollupInfo (obj)
- RelOp (obj)

## BitmapType (RelOpBaseType)

- HashKeys (obj)
- RelOp (obj)

## CollapseType (RelOpBaseType)

- GroupBy (obj)
- RelOp (obj)

## SwitchType (ConcatType)

- Predicate (obj)

## MergeType (RelOpBaseType)

- ManyToMany
- InnerSideJoinColumns (obj)
- OuterSideJoinColumns (obj)
- Residual (obj)
- PassThru (obj)
- StarJoinInfo (obj)
- RelOp (obj[])

## NestedLoopsType (RelOpBaseType)

- Optimized
- WithOrderedPrefetch
- WithUnorderedPrefetch
- Predicate (obj)
- PassThru (obj)
- OuterReferences (obj)
- PartitionId (obj)
- ProbeColumn (obj)
- StarJoinInfo (obj)
- RelOp (obj[])

## SegmentType (RelOpBaseType)

- GroupBy (obj)
- SegmentColumn (obj)
- RelOp (obj)

## SequenceType (RelOpBaseType)

- RelOp (obj[])

## SplitType (RelOpBaseType)

- ActionColumn (obj)
- RelOp (obj)

## TopType (RelOpBaseType)

- RowCount
- Rows
- IsPercent
- WithTies
- TieColumns (obj)
- OffsetExpression (obj)
- TopExpression (obj)
- RelOp (obj)

## UDXType (RelOpBaseType)

- UDXName
- UsedUDXColumns (obj)
- RelOp (obj)

## WindowType (RelOpBaseType)

- RelOp (obj)

## WindowAggregateType (RelOpBaseType)

- RelOp (obj)

## PutType (RemoteQueryType)

- ShuffleType
- ShuffleColumn
- RelOp (obj)

## SimpleUpdateType (RowsetType)

- DMLRequestSort
- SeekPredicate (obj)
- SeekPredicateNew (obj)
- SetPredicate (obj)

## SetPredicateElementType (ScalarExpressionType)

- SetPredicateType

## UpdateType (RowsetType)

- WithOrderedPrefetch
- WithUnorderedPrefetch
- DMLRequestSort
- SetPredicate (obj[])
- ProbeColumn (obj)
- ActionColumn (obj)
- OriginalActionColumn (obj)
- RelOp (obj)

## CreateIndexType (RowsetType)

- RelOp (obj)

## SpoolType (RelOpBaseType)

- Stack
- PrimaryNodeId
- SeekPredicate (obj)
- SeekPredicateNew (obj)
- RelOp (obj)

## BatchHashTableBuildType (RelOpBaseType)

- BitmapCreator
- RelOp (obj)

## ScalarInsertType (RowsetType)

- DMLRequestSort
- SetPredicate (obj)

## TopSortType (SortType)

- Rows
- WithTies

## RemoteRangeType (RemoteType)

- SeekPredicates (obj)

## RemoteFetchType (RemoteType)

- RelOp (obj)

## RemoteModifyType (RemoteType)

- SetPredicate (obj)
- RelOp (obj)

## GenericType (RelOpBaseType)

- RelOp (obj[])

## ScalarType

- ScalarString
- Aggregate (obj)
- Arithmetic (obj)
- Assign (obj)
- Compare (obj)
- Const (obj)
- Convert (obj)
- Identifier (obj)
- IF (obj)
- Intrinsic (obj)
- Logical (obj)
- MultipleAssign (obj)
- ScalarExpressionList (obj)
- Sequence (obj)
- Subquery (obj)
- UDTMethod (obj)
- UserDefinedAggregate (obj)
- UserDefinedFunction (obj)
- InternalInfo (obj)

## ScalarExpressionListType

- ScalarOperator (obj[])

## ConstType

- ConstValue

## IdentType

- Table
- ColumnReference (obj)

## CompareType

- CompareOp
- ScalarOperator (obj[])

## ConvertType

- DataType
- Length
- Precision
- Scale
- StyleIndex
- Implicit
- Style (obj)
- ScalarOperator (obj)

## ArithmeticType

- Operation
- ScalarOperator (obj[])

## LogicalType

- Operation
- ScalarOperator (obj[])

## UDAggregateType

- Distinct
- UDAggObject (obj)
- ScalarOperator (obj[])

## AggregateType

- AggType
- Distinct
- ScalarOperator (obj[])

## AssignType

- ColumnReference (obj)
- ScalarOperator (obj)

## MultAssignType

- Assign (obj[])

## ConditionalType

- Condition (obj)
- Then (obj)
- Else (obj)

## IntrinsicType

- FunctionName
- ScalarOperator (obj[])

## ScalarSequenceType

- FunctionName

## UDFType

- FunctionName
- IsClrFunction
- ScalarOperator (obj[])
- CLRFunction (obj)

## UDTMethodType

- CLRFunction (obj)
- ScalarOperator (obj[])

## CLRFunctionType

- Assembly
- Class
- Method

## SubqueryType

- Operation
- ScalarOperator (obj)
- RelOp (obj)

## SetOptionsType

- ANSI_NULLS
- ANSI_PADDING
- ANSI_WARNINGS
- ARITHABORT
- CONCAT_NULL_YIELDS_NULL
- NUMERIC_ROUNDABORT
- QUOTED_IDENTIFIER

## BatchSequence

- Batch (obj[])

## Batch
batch 
- Statements (obj[])

## StmtCondTypeCondition

- QueryPlan (obj)
- UDF (obj[])

## StmtCondTypeThen
node
- Statements (obj)

## StmtCondTypeElse
node
- Statements (obj)

## CursorPlanTypeOperation
node
- OperationType (subTitle)
- QueryPlan (obj)
- UDF (obj[])

## ReceivePlanTypeOperation
node
- OperationType (subTitle)
- QueryPlan (obj)

## OrderByTypeOrderByColumn

- Ascending
- ColumnReference (obj)

## DefinedValuesListTypeDefinedValue

- ValueVector (obj)
- ColumnReference (obj[])
- ScalarOperator (obj)

## DefinedValuesListTypeValueVector

- ColumnReference (obj[])

## RunTimeInformationTypeRunTimeCountersPerThread

- Thread
- BrickId
- ActualRebinds
- ActualRewinds
- ActualRows
- ActualRowsRead
- Batches
- ActualEndOfScans
- ActualExecutions
- ActualExecutionMode
- TaskAddr
- SchedulerId
- FirstActiveTime
- LastActiveTime
- OpenTime
- FirstRowTime
- LastRowTime
- CloseTime
- ActualElapsedms
- ActualCPUms
- ActualScans
- ActualLogicalReads
- ActualPhysicalReads
- ActualReadAheads
- ActualLobLogicalReads
- ActualLobPhysicalReads
- ActualLobReadAheads
- SegmentReads
- SegmentSkips
- ActualLocallyAggregatedRows
- InputMemoryGrant
- OutputMemoryGrant
- UsedMemoryGrant
- IsInterleavedExecuted
- ActualJoinType

## RunTimePartitionSummaryTypePartitionsAccessed

- PartitionCount
- PartitionRange (obj[])

## RunTimePartitionSummaryTypePartitionRange

- Start
- End

## ConstantScanTypeValues

- Row (obj[])

## ParallelismTypeActivation

- Type
- FragmentElimination
- Object (obj)

## ParallelismTypeBrickRouting

- Object (obj)
- FragmentIdColumn (obj)

## ShowPlanXML

- Version
- Build
- ClusteredMode
- BatchSequence (obj)
