SELECT @TestpassList = COALESCE(@TestpassList + '($$)', '') 
						+ tpd.Name + '.' + tp.UniqueKey 
						+ '($)' + CAST(tp.Id AS NVARCHAR)
		FROM dbo.TestpassDefinition(NOLOCK) as tpd 
			INNER JOIN dbo.Testpass(NOLOCK) as tp ON tp.TestpassDefinitionId = tpd.Id
			INNER JOIN dbo.ScheduleTestpassMapping (NOLOCK) stMap ON stMap.TestpassId = tp.Id
		WHERE stMap.ScheduleId = @ElementId 			
	