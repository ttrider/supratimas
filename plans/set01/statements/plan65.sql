SELECT @statusId = [Id]
	FROM [dbo].[Status] WITH (NOLOCK)
	WHERE @status = [Status]
	AND @statusType = [Type]

    