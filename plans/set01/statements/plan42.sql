SELECT sch.Id
		 FROM dbo.Schedule AS sch WITH (NOLOCK)
		 WHERE sch.[Guid] = @GuidId	
	