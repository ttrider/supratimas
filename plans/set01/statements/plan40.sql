SELECT @mixId = M.Id
	FROM dbo.Mix AS M
	WHERE M.Guid = @mixGuid

	
	/*
	** Add any new values to Platform
	*/
	