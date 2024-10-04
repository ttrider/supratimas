UPDATE TCR
		SET TestCasePathHash = hashbytes('md5',TestCasePath)
	FROM upload.TestCaseResult AS TCR
	INNER JOIN upload.TeuResult AS R ON R.Id = TCR.GroupId
	INNER JOIN upload.TeuResultLog AS RL ON RL.Id = R.TeuResultLogId
	WHERE RL.Id = @logId

	
	/*
	** Insert new rows in TestCasePath
	*/	
	