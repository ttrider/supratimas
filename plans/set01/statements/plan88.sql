SELECT @buildFlavorId = [Id]
	FROM [dbo].[BuildFlavor]
	WHERE @buildVersionId = [BuildVersionId]
	AND UPPER(@sku) = UPPER([SKU])
	AND UPPER(@architecture) = UPPER([Architecture])
	AND UPPER(@type) = UPPER([Type])
	AND UPPER(@culture) = UPPER([Culture])
	AND UPPER(@language) = UPPER([Language])

	