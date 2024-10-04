SELECT a.Id as MachineSetId, a.ExecutionStatusLink AS MachineSetExecutionStatusLink,
           a.CustomExecutionFilePath, b.Status AS MachineSetStatus,
           c.Name AS TEDName, c.ExecutionStatusLink AS TEDExecutionStatusLink,
		   c.ResolvedName as ResolvedTEDName, c.Id as ResolvedTEDId , SetupWtqFilePath,
		   SetupDTWInstanceWtqFilePath, TargetPoolWtqFilePath, a.ImplementationDetails,
		   a.RunLogDirectory,
		   a.StartDate,
		   a.EndDate, a.Comments,
                   implementationdetails.value('(/Implementation/ExecutionWttInfo/@Datastore)[1]', 'nvarchar(100)') as Datastore 		
	FROM dbo.MachineSet AS a WITH (NOLOCK) INNER JOIN
         dbo.[Status] AS b WITH (NOLOCK) ON a.StatusId = b.Id INNER JOIN
         dbo.ResolvedTED AS c WITH (NOLOCK) ON c.Id = a.ResolvedTEDId 
    WHERE a.Id = @MachineSetId  

