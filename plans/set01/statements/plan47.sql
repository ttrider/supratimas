INSERT INTO #InputFailure (Id)
		SELECT DISTINCT Id FROM @FailureIds;
		
	