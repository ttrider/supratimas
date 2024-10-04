SELECT @isNewSchedule = 0, @ScheduleIntId = Id
    FROM dbo.Schedule WITH (NOLOCK)
    WHERE [Guid] = @scheduleId

    