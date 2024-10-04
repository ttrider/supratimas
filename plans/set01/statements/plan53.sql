SELECT @MixId = Id 
    FROM dbo.Mix WITH (NOLOCK) 
    WHERE [Guid] = @MixGuid

    