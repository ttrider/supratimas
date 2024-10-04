SELECT 
T.Id,
T.TestPassId,
T.MixId,
T.RunLogDirectory,
T.TCPassCount,
T.TCFailCount,
T.TCSkipCount,
T.TCWarnCount,
T.TCBlockCount,
T.WTTJobId,
T.RecordCreated,
T.RecordUpdated,
T.IsRerunPrimary,
T.IsRerun,
DT.RerunSourceId,
T.RerunCount 
FROM reporting.TEUs T with (nolock) 
join dbo.TEU  DT with (nolock) 
on T.Id = DT.Id 
WHERE T.TestPassId in (1382893,1382907,1382914,1382917,1382705,1397620,1382470,1382630,1382766)
