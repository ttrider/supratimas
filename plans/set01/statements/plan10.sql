SELECT a.* 
    FROM  (
			SELECT     bf.Sku, bf.Architecture, bf.Type, bf.Culture, bf.[Language], bv.Branch, 
								  bv.MajorVer, bv.MinorVer, bv.BuildNo, bv.Revision, bv.[Timestamp] AS [Build Timestamp], 
								  sch.StartDate, sch.EndDate, st.[Status], SUM(teu.TCSkipCount + teu.TCPassCount + teu.TCWarnCount + teu.TCFailCount + teu.TCBlockCount) 
								  AS Total, SUM(teu.TCPassCount + teu.TCWarnCount + teu.TCFailCount + teu.TCBlockCount) AS Attempted, fp.Path, fp.Id as FeaturePathId, mix.Id as MixId, 
								  SUM(teu.TCPassCount) AS Pass, SUM(teu.TCFailCount) AS Fail, SUM(teu.TCWarnCount) AS Warn, SUM(teu.TCSkipCount) AS Skipped, SUM(teu.TCBlockCount) AS Blocked, 
								  sch.Id as ScheduleId
			FROM         dbo.ResolvedTED AS rted WITH (NOLOCK) INNER JOIN
								  dbo.BuildFlavor AS bf WITH (NOLOCK) INNER JOIN
								  dbo.Mix AS mix WITH (NOLOCK) ON bf.Id = mix.BuildFlavorId INNER JOIN
								  dbo.BuildVersion AS bv WITH (NOLOCK) ON bf.BuildVersionId = bv.Id INNER JOIN
								  dbo.Schedule AS sch WITH (NOLOCK) ON mix.ScheduleId = sch.Id INNER JOIN
								  dbo.[Status] AS st WITH (NOLOCK) ON sch.StatusId = st.Id ON rted.MixId = Mix.Id INNER JOIN
								  dbo.View_PrimaryTeu AS teu WITH (NOLOCK) ON rted.Id = teu.ResolvedTEDId RIGHT OUTER JOIN
								  dbo.FeaturePath AS fp WITH (NOLOCK) ON teu.FeaturePathId = fp.Id
			GROUP BY bf.Sku, bf.Architecture, bf.Type, bf.Culture, bf.[Language], bv.Branch, 
								  bv.MajorVer, bv.MinorVer, bv.BuildNo, bv.Revision, bv.[Timestamp], sch.StartDate, 
								  sch.EndDate, st.[Status], fp.Path, fp.Id, Mix.Id, sch.Id    
		  ) a 
    WHERE a.MixId=@MixId  
    ORDER BY Path

