SELECT @buildFlavorId = Mix.BuildFlavorId
    FROM dbo.Mix WITH (NOLOCK)
    WHERE Mix.Guid = @mixGuid

    