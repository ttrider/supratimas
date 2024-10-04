SELECT @MetaDataPathId = Id
	FROM dbo.MetaDataPath
	WHERE [Path] = @MetaDataPath

	