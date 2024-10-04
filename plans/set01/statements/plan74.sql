UPDATE dbo.Role
	SET   [BuildFlavorId] = @buildId
		  ,[RemoteDebuggingCmd] = @remoteDebuggingCmd
	WHERE Guid = @roleId

    