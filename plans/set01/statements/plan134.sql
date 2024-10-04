SELECT 
RS.Id, 
DS.Guid, 
DS.RunLogDirectory,
RS.Name,
RS.TestpassId,
SM.ParentScheduleId 
FROM  reporting.Schedules RS with (nolock) 
INNER JOIN dbo.Schedule DS with (nolock) on RS.id = DS.id 
FULL OUTER JOIN dbo.ScheduleMapping SM with (nolock) on SM.ChildScheduleId = DS.id 
WHERE RS.testpassId in (1382911,1382859,1382849) 
