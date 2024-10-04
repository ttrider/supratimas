SELECT @StartDate = MIN(mix.StartDate)
	FROM dbo.Mix (NOLOCK) as mix 
		INNER JOIN dbo.TestpassPackageMapping(NOLOCK) tpmap ON tpMap.MixId = mix.Id
	WHERE tpMap.TestpassId = @TestpassId

	-- Update the Testpass table with Start Date
	