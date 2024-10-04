SELECT 
        @mixId = M.Id
        ,@resolvedTedId = RT.Id
    FROM dbo.Mix AS M WITH (NOLOCK)
    INNER JOIN dbo.ResolvedTED AS RT WITH (NOLOCK) ON M.Id = RT.MixId
    WHERE M.[Guid] = @mixGuidId;

    -- Verify the mix exists.
    