SELECT @ModifierList = COALESCE(@ModifierList + ',', '') + md.Name						
		FROM dbo.PackageModifierMapping (NOLOCK) pmMap
			INNER JOIN dbo.Modifier(NOLOCK) md ON md.Id = pmMap.ModifierId
			INNER JOIN dbo.Mix(NOLOCK) mix ON mix.Id = pmMap.MixId
		WHERE mix.ScheduleId = @ElementId 	
	