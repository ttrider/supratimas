MERGE INTO dbo.BuildVersion WITH (HOLDLOCK) AS TGT
	USING (
		SELECT LOWER(@branch) AS Branch
			,@majorVer AS [MajorVer]
			,@minorVer AS [MinorVer]
			,@buildNo AS [BuildNo]
			,@revision AS [Revision]
			,@timestamp AS [TimeStamp]
			,ISNULL(@suffix, '') AS [Suffix]
			,@isPrivateBuild AS IsPrivateBuild
			,@fullbuildnumber AS FullBuildNumber
		) AS SRC
		ON SRC.[FullBuildNumber] = TGT.[FullBuildNumber]
	WHEN NOT MATCHED
		THEN
			INSERT (
				[Branch]
				,[MajorVer]
				,[MinorVer]
				,[BuildNo]
				,[Revision]
				,[Timestamp]
				,[Suffix]
				,[IsPrivateBuild]
				,[FullBuildNumber]
				)
			VALUES (
				SRC.[Branch]
				,SRC.[MajorVer]
				,SRC.[MinorVer]
				,SRC.[BuildNo]
				,SRC.[Revision]
				,SRC.[Timestamp]
				,SRC.[Suffix]
				,SRC.[IsPrivateBuild]
				,SRC.[FullBuildNumber]
				);
    