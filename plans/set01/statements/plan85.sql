SELECT @ElementStageId = elStage.Id
	FROM dbo.ElementStage AS elStage
	WHERE elStage.Stage = @ElementStage

	