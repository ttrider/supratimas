INSERT INTO #FailureBugCollection
	(
		InternalFailureId,
		FailureGuid,
		FailureStatus,
		UpdatedByAlias,
		InternalBugId,
		[BugNumber],
		[BugDatabaseName],
		[IsBranchSpecificBug]
	)
	SELECT F.InternalFailureId,
		   F.FailureGuid,
		   F.FailureStatus,
		   F.UpdatedByAlias,
		   F.InternalBugId,
		   F.BugNumber,
		   F.BugDatabaseName,
		   F.IsBranchSpecificBug
	FROM @FailureBugMappings F

	-- Resolve FailureId (If needed)
	