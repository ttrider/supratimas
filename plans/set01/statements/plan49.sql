SELECT step_id,
           step_name,
           subsystem,
           command,
           flags,
           cmdexec_success_code,
           on_success_action,
           on_success_step_id,
           on_fail_action,
           on_fail_step_id,
           server,
           database_name,
           database_user_name,
           retry_attempts,
           retry_interval,
           os_run_priority,
           output_file_name,
           last_run_outcome,
           last_run_duration,
           last_run_retries,
           last_run_date,
           last_run_time,
         proxy_id
    FROM msdb.dbo.sysjobsteps
    WHERE (job_id = @job_id)
      AND ((@step_id IS NULL) OR (step_id = @step_id))
    ORDER BY job_id, step_id
  