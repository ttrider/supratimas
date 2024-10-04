SELECT @FrTedId = Id
    FROM dbo.ResolvedTed WITH (NOLOCK)
    WHERE Guid = @FrTedGuid
    
    