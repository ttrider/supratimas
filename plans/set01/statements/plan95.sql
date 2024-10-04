SELECT @ScheduleId = Id 
    FROM dbo.Schedule WITH (NOLOCK) 
    WHERE [Guid] = @ScheduleGuid

    