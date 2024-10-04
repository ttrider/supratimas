UPDATE FV SET 
		FV.Segment1 = LEFT(dbo.Function_Token(FV.Name,'.',1), 32),
		FV.Segment2 = LEFT(dbo.Function_Token(FV.Name,'.',2), 32),
		FV.Segment3 = LEFT(dbo.Function_Token(FV.Name,'.',3), 32),
		FV.Segment4 = LEFT(dbo.Function_Token(FV.Name,'.',4), 32)
	FROM dbo.PlatformBspFirmware AS FV
	WHERE FV.Segment1 IS NULL

	/*
	** Recalc our ranking
	*/
	