SELECT @job_name = name,
           @owner_sid = owner_sid
    FROM msdb.dbo.sysjobs_view
    WHERE (job_id = @job_id)
    
    -- the view would take care of all the permissions issues.
    