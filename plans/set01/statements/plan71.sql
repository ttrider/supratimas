SELECT @isNewTed = 0
    FROM [dbo].[ResolvedTED]
    WHERE Guid = @frTedId

    