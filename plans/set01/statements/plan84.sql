INSERT INTO #FailureCollection
	(
		InternalTestpassId,		
		TestpassUniqueKey,	
		TestpassDefinitionName, 
		FailureType, 
		FailureCategory,
		FailureSubCategory,
		FailureGuid,
		FailureStatus,
		FailureTriageOwner,
		FailureAssignedTo,
		FailureTitle,
		IsAutoResolved,
		DoNotUseForAutoAnalysis
	)
	SELECT  FT.InternalTestpassId,		
			FT.TestpassUniqueKey,		
			FT.TestpassDefinitionName, 
			FT.FailureType, 
			FT.FailureCategory,
			FT.FailureSubCategory,
			FT.FailureGuid,
			FT.FailureStatus,
			FT.FailureTriageOwner,
			FT.FailureAssignedTo,
			FT.FailureTitle,
			FT.IsAutoResolved,
			FT.DoNotUseForAutoAnalysis
	FROM @Failures FT
	-- If not already exists
	LEFT OUTER JOIN dbo.Failure F WITH(NOLOCK)
	ON
		FT.FailureGuid = F.[Guid]
	WHERE F.Id IS NULL

	-- Remove duplicates (If any)
	