UPDATE [execution].[Submission]
	SET  
		BranchId = @branchId,
		BuildId = @buildId,
		DeviceTypeId = @deviceTypeId,
		ImageTypeId = @imageTypeId,
		RequestedById = @requestedById,
		TeamId = @teamId,
		TestPassId = @testPassId,
		UniqueKeyId = @uniqueKeyId,
		TestPassTypeId = @testPassTypeId,
		TestLanguageId = @testLanguageId,
		TellusFrTedId = @tellusFrTedId	

	WHERE [PkSetId] = @submissionSetId AND [PkId] = @submissionId AND [PkSetPartition] = @submissionSetPartition
