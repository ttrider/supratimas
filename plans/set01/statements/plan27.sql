SELECT @resultCount = COUNT(*) FROM upload.TestCaseResult AS TCR WHERE TCR.GroupId = @groupId
	