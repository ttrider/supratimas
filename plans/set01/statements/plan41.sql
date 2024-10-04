DECLARE @primaryResultCollectionTypeId INT = (SELECT [PkId] FROM [monitoring].[ResultCollectionType] WHERE [Name] = 'Primary')

	-- If input does not specify a partition, set it to current system value.
	