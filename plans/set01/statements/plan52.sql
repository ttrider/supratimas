INSERT INTO #TestpassCollection (InternalTestpassId,
									 TestpassUniqueKey,
									 TestpassDefinitionName,
									 TestpassGrade,
									 ReportingUrl,
									 TestpassFlightingGrade)
	SELECT T.InternalTestpassId,
		   T.TestpassUniqueKey,
		   T.TestpassDefinitionName,
		   T.TestpassGrade,
		   T.ReportingUrl,
		   T.TestpassFlightingGrade
	FROM @Testpasses T

	-- Lookup Testpass Definition (If needed)
	