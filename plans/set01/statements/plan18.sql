UPDATE [dbo].[TEUCountsByResolvedTED]
		SET [LastUpdateTime] = GETDATE()
		WHERE ResolvedTEDId IN (SELECT ResolvedTEDId FROM inserted) 
