SELECT @current_rows_per_job = COUNT(*)
  FROM msdb.dbo.sysjobhistory with (TABLOCKX)
  WHERE (job_id = @job_id)

  -- Delete the oldest history row(s) for the job being inserted if the new row has
  -- pushed us over the per-job row limit (MaxJobHistoryRows)
  