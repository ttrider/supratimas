SELECT a.MachineName, a.Name AS RoleName, c.FullBuildNumber,
               b.Architecture + b.Type AS Flavor, b.Language + '-' + b.Culture AS LanguageCulture,
               b.SKU, a.RemoteDebuggingCmd AS KDLink, d.RunLogDirectory AS MachineSetFolder,
               e.[Status] AS MachineSetStatus, d.StartDate AS MachineSetStartDate,
               d.EndDate AS MachineSetEndDate, a.Id as RoleId,
               implementationdetails.value('(/Implementation/TargetExecutionInfo/@Datastore)[1]', 'nvarchar(100)') as Datastore
	FROM dbo.Role AS a WITH (NOLOCK) INNER JOIN
             dbo.MachineSet AS d WITH (NOLOCK) ON a.MachineSetId = d.Id left outer JOIN 
             dbo.BuildFlavor AS b WITH (NOLOCK) ON b.Id = a.BuildFlavorId left outer JOIN
         dbo.BuildVersion AS c WITH (NOLOCK) ON c.Id = b.BuildVersionId INNER JOIN
         dbo.[Status] AS e WITH (NOLOCK) ON e.Id = d.StatusId  
        WHERE a.MachineSetId = @MachineSetId  

