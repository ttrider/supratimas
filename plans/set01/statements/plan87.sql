INSERT INTO dbo.EntityStaging (
				BatchGuid,
				EntityName,
				Payload)
			SELECT BatchGuid,
				EntityName,
				Payload
			FROM @payloads
			