INSERT INTO @BugListForMix (MixId, BugCount)
    SELECT  dbo.ResolvedTED.MixId, count(DISTINCT dbo.FailureBugMapping.BugId)
    FROM    dbo.FailureBugMapping WITH (NOLOCK) 
		    INNER JOIN dbo.View_PrimaryFailure AS F WITH (NOLOCK) ON dbo.FailureBugMapping.FailureId = F.Id 
		    RIGHT OUTER JOIN dbo.ResolvedTED WITH (NOLOCK) ON F.ResolvedTEDId = dbo.ResolvedTED.Id
		    INNER JOIN dbo.Mix WITH (NOLOCK) on dbo.Mix.Id = dbo.ResolvedTED.MixId
    WHERE dbo.FailureBugMapping.BugId IS NOT NULL		
	      and dbo.Mix.Id = @MixId 
    GROUP BY dbo.ResolvedTED.MixId;
    
    