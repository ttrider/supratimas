WITH TPC AS ( --Exclude test pass names that doesn't exist in OLR
        SELECT DISTINCT TPC.TestPassName
        FROM @TestpassCollection TPC
            INNER JOIN dbo.TestpassDefinition TPD WITH (NOLOCK) ON TPD.Name = TPC.TestPassName
    )
    INSERT INTO @Result(Id, StartDateTime, EndDateTime)
	SELECT B.Id
        ,B.StartDateTime
        ,B.EndDateTime
	FROM TPC
    LEFT JOIN (
		SELECT 
			TP.Name, MAX(TP.Id) AS TestpassId --Get latest testpass only in cases where we have multiple instances
		FROM Reporting.Testpasses AS TP WITH (NOLOCK)
		INNER JOIN Reporting.Mixes AS M WITH (NOLOCK)
			ON TP.Id = M.TestpassId
		INNER JOIN @TestpassCollection AS TPC 
			ON TP.Name = TPC.TestpassName
		INNER JOIN dbo.BuildVersion AS BV WITH (NOLOCK) 
			ON M.BuildVersionId = BV.Id 
		WHERE (BV.BuildString = @BuildString OR BV.BuildString = @RelativeBuildString)
			AND TP.IsOfficial = 1
			AND TP.IsValid = 1	
		GROUP BY TP.Name
		) AS A ON A.Name = TPC.TestPassName
	LEFT JOIN Reporting.Testpasses AS B WITH (NOLOCK) ON A.TestpassId = B.Id
			

    