SELECT @logPathId = Id FROM dbo.LogFilePath
	WHERE @logFile = [Path]

	