SELECT @TestpassTypeId = Id 
	FROM dbo.TestPassType WITH(NOLOCK)
	WHERE [Name] = @Name
	
	