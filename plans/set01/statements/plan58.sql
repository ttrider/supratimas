SELECT @UserId = U.Id 
	FROM dbo.Users AS U
	WHERE U.Alias = @Alias
	
	