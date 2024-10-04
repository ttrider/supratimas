MERGE Reporting.Schedules AS tgt
USING 
(	  SELECT DISTINCT 
         S.Id
         , S.BuildVersionId
         , STM.TestpassId
         , S.Name
         , S.StartDate
         , S.EndDate
         , S.IsValidSchedule
         , S.StatusId
         , S.RecordLastUpdated
       FROM   [dbo].[Schedule] AS S WITH (NOLOCK)
              INNER JOIN @ScheduleIds AS Sids 
                      ON S.Id = Sids.Id
              INNER JOIN [dbo].[ScheduleTestpassMapping] AS STM WITH (NOLOCK)
                      ON S.Id = STM.ScheduleId
              
) AS src
ON src.StartDate= tgt.StartDateTime AND tgt.Id = src.Id 
    WHEN MATCHED AND (@DateOnOrAfter IS NULL OR @DateOnOrAfter < src.RecordLastUpdated)
    THEN UPDATE
     SET tgt.BuildVersionId		    = src.BuildVersionId
             , tgt.TestpassId		= src.TestpassId
             , tgt.Name				= src.Name
             , tgt.EndDateTime		= src.EndDate
             , tgt.IsValidSchedule  = src.IsValidSchedule
             , tgt.StatusId			= src.StatusId
             , tgt.RecordUpdated	= GETDATE()
WHEN NOT MATCHED THEN
    INSERT
    (
       [Id]
      ,[BuildVersionId]
      ,[TestpassId]
      ,[Name]
      ,[StartDateTime]
      ,[EndDateTime]
      ,[IsValidSchedule]
      ,[StatusId]
    )
    VALUES
    (
        src.Id
        ,src.BuildVersionId
        ,src.TestpassId
        ,src.Name
        ,src.StartDate
        ,src.EndDate
        ,src.IsValidSchedule
        ,src.StatusId
    );
