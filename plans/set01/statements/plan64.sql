IF EXISTS (SELECT * 
				   FROM dbo.Mix AS mix WITH (NOLOCK)
				   WHERE mix.Id = @ElementId 
				   AND mix.ScheduleId IS NOT NULL)
		