SELECT sch.Id as ScheduleId,
		sch.Name as ScheduleName,
		sch.StartDate,
		sch.EndDate,
		sch.Comments
	FROM dbo.Schedule AS sch WITH (NOLOCK)
	WHERE sch.Id = @ScheduleId
	
