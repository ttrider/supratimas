SELECT a.Id AS UEUId, a.Name AS UEUName, a.StartDate, a.EndDate, a.RunLogDirectory as LogDirectory, 
           a.PassCount AS PassTotal, a.FailCount AS FailTotal, a.WarnCount AS WarnTotal, 
		   a.SkipCount AS SkippedTotal, a.BlockCount AS BlockedTotal, a.CustomUnc, 
           b.Status, c.Name As RoleName, a.Owner, c.MachineName,
           a.PassCount+ a.FailCount + a.WarnCount + a.SkipCount + a.BlockCount AS Total,
		  d.RunLogDirectory AS MachineSetFolder, c.Id as RoleId 
    FROM  dbo.UEU AS a WITH (NOLOCK) INNER JOIN
          dbo.Status AS b WITH (NOLOCK) ON b.Id = a.StatusId LEFT OUTER JOIN
          dbo.Role AS c WITH (NOLOCK) ON c.Id = a.PrimaryRoleId INNER JOIN
		  dbo.MachineSet d WITH (NOLOCK) ON a.MachineSetId = d.Id
    WHERE a.MachineSetId = @MachineSetId  
    ORDER BY a.StartDate ASC

