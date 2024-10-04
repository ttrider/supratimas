SELECT TOP 1
   @DateOnOrAfter = CASE h.run_date WHEN 0 THEN NULL ELSE
    CONVERT(datetime, 
            STUFF(STUFF(CAST(h.run_date as nchar(8)), 7, 0, '-'), 5, 0, '-') + N' ' + 
            STUFF(STUFF(SUBSTRING(CAST(1000000 + h.run_time as nchar(7)), 2, 6), 5, 0, ':'), 3, 0, ':'), 
            120) END
FROM   msdb.dbo.sysjobhistory AS h
       INNER JOIN msdb.dbo.sysjobs AS j
               ON h.job_id = j.job_id
WHERE  h.run_status = 1 
    AND h.step_id = 0
    AND j.name = 'OurLabReporting:RefreshAggregateTables'
ORDER BY h.run_date DESC, h.run_time DESC	


