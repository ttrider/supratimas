SELECT dbo.MachineSet.Id as MachineSetId, 
           dbo.MachineSet.StartDate As MachineSetStartDate,
           dbo.MachineSet.EndDate As MachineSetEndDate, 
		   dbo.MachineSet.RunLogDirectory AS MachineSetDirectory,
	       dbo.MachineSet.EnvironmentSetupFailure,
           dbo.MachineSet.ReclaimedBeforeCompletion,
		   dbo.MachineSet.EnvironmentSetupStarted,
		   dbo.MachineSet.TestExecutionStarted,
		   dbo.MachineSet.Comments,	
		   dbo.ResolvedTED.Id as ResolvedTEDId,
           CASE WHEN dbo.ResolvedTED.ResolvedName IS NOT NULL THEN dbo.ResolvedTED.ResolvedName
		   ELSE dbo.ResolvedTED.Name	
		   END AS ResolvedTEDName,
		   tb_MachineSetStatus.Status as MachineSetStatus,
		   dbo.Mix.EffectiveContextName,          	
		   dbo.Mix.EffectivePackageName
	FROM dbo.Mix WITH (NOLOCK) INNER JOIN 
         dbo.MachineSet WITH (NOLOCK) ON dbo.Mix.Id = dbo.MachineSet.MixId INNER JOIN 
         dbo.[Status] AS tb_MachineSetStatus WITH (NOLOCK) ON tb_MachineSetStatus.Id = dbo.MachineSet.StatusId INNER JOIN  
         dbo.ResolvedTED WITH (NOLOCK) ON dbo.MachineSet.ResolvedTEDId = dbo.ResolvedTED.Id 
	WHERE dbo.Mix.ScheduleId =  @ScheduleId
	ORDER BY EffectivePackageName ASC,
             EffectiveContextName ASC,
			 ResolvedTEDId ASC,
			 ResolvedName ASC,
			 dbo.MachineSet.StartDate ASC
