IF EXISTS (SELECT mix.Id
				   FROM dbo.Mix AS mix
				   WHERE mix.Id = @ElementId)
		