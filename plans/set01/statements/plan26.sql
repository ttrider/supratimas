SELECT @ElementTypeId = elType.Id
	FROM dbo.ElementType AS elType
	WHERE [Type] = @ElementType

	