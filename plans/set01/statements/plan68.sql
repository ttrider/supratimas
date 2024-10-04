INSERT INTO @distinctMappings (
		BugNumber,
		BugDatabase,
		BugType,
		IsBranchSpecific,
		SectionEntryId,
		TestpassName,
		TestPassSignature)
	SELECT DISTINCT
		BugNumber,
		BugDatabase,
		BugType,
		IsBranchSpecific,
		SectionEntryId,
		TestpassName,
		CONVERT(NVARCHAR(750), LOWER([Product]) + N';' +  LOWER([Branch]) + N';' + CONVERT(NVARCHAR(5), [BuildNumber]) + N';' 
			+ CONVERT(NVARCHAR(5), [BuildRevision]) + N';' + CONVERT(NVARCHAR(24), [BuildTimestamp], 126) + N';' + LOWER([RunType]) + N';'
			+ LOWER([DataSource]))
	FROM @testpassBugs;

	-- get branchtestpassstatus ids
	