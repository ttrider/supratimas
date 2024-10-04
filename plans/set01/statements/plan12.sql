SELECT @isNewRole = 0 
    FROM [dbo].[Role] WITH (NOLOCK)
    WHERE Guid = @roleId
    
    