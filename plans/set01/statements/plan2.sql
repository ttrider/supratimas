IF (EXISTS (SELECT    *
              FROM      msdb.dbo.sysjobs_view
              WHERE     (job_id = @job_id)
              AND       (master_server = 1) )) -- master_server = 1 filters on MSX jobs in this TSX server
              AND       (PROGRAM_NAME() NOT LIKE @program_name)
  