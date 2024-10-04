SELECT @resolvedTedIntId = Id 
    FROM dbo.ResolvedTED WITH (NOLOCK) 
    WHERE [Guid] = @resolvedTEDId;

    