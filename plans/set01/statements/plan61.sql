SELECT	@PackageName=EffectivePackageName,
			@ContextName=EffectiveContextName,
			@SKU=SKU,
			@Arch=Architecture,
			@BuildType=Type,
			@Lang=Language+'-'+Culture
	FROM dbo.Mix
	INNER JOIN dbo.BuildFlavor bf ON bf.Id = mix.buildflavorid
	WHERE mix.Id = @mixId

	