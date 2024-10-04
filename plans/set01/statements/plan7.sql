SELECT @TeamId = Id 
    FROM dbo.Team WITH(NOLOCK)
    WHERE [Name] = @Name
    
    