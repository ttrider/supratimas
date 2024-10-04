SELECT TOP 1 @TestpassId = Id, @IsLocked = IsLocked  
    FROM dbo.Testpass WITH(NOLOCK)
    WHERE TestpassDefinitionId = @TestpassDefinitionId
        AND UniqueKey = @UniqueKey
    
    