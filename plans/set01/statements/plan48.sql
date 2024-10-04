UPDATE BV SET 
		BV.Segment1 = LEFT(dbo.Function_Token(BV.Name,'.',1), 32),
		BV.Segment2 = LEFT(dbo.Function_Token(BV.Name,'.',2), 32),
		BV.Segment3 = LEFT(dbo.Function_Token(BV.Name,'.',3), 32),
		BV.Segment4 = LEFT(dbo.Function_Token(BV.Name,'.',4), 32)
	FROM dbo.PlatformBsp AS BV
	WHERE BV.Segment1 IS NULL

	/*
	** Recalc our ranking
	*/
	