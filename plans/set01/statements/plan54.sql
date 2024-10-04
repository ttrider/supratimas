SELECT @local_TotalTCCount = A.Total
			,@local_PassedTCCount = A.PassTotal
			,@local_FailedTCCount = A.FailTotal
			,@local_WarnedTCCount = A.WarnTotal
			,@local_BlockedTCCount = A.BlockTotal
			,@local_SkippedTCCount = A.SkipTotal
		FROM dbo.View_TEUAndTCCountsBySchedule AS A WITH (NOLOCK)
		WHERE A.ScheduleId = @local_ScheduleId

		-- Get TEU Counts     
		