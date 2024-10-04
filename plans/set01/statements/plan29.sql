UPDATE FB 
		SET FB.TeuNameHash = CHECKSUM(T.Name)
	FROM FailureBugMapping AS FB WITH(NOLOCK)
	INNER JOIN Failure AS F WITH(NOLOCK) ON F.Id = FB.FailureId
	INNER JOIN Teu AS T WITH(NOLOCK) ON T.Id = F.TeuId
	INNER JOIN inserted AS I ON I.FailureId = FB.FailureId AND I.BugId = FB.BugId

	-- Dirty TED so we know to recrawl FailureBugMapping
	--UPDATE TED
	--	SET LastUpdateTime = GETDATE()
	--FROM inserted AS I
	--INNER JOIN Failure AS F WITH(NOLOCK) ON F.Id = I.FailureId
	--INNER JOIN Teu AS T WITH(NOLOCK) ON T.Id = F.TeuId
	--INNER JOIN TEUCountsByResolvedTED AS TED ON TED.ResolvedTEDId = T.ResolvedTedId
	
