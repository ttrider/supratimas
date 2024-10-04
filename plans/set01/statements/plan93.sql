INSERT INTO @InProgressMixStatusList (StatusId)
		SELECT DISTINCT Id
		FROM dbo.[Status] 
		WHERE Type='Mix' 
			AND [Status] IN ('InProgress', 'WaitingForBuild', 'ProcessingNewBuild')


	