INSERT INTO [dbo].[DatamartPoisonMessage]
           ([Id]
		   ,[AgentId]
           ,[ErrorType]
           ,[Exception]
		   ,[MessageType]
		   ,[MessageId]
           ,[MessageBody]
		   ,[InRawFormat])
     VALUES
           (@id
		   ,@agentId
           ,@error
           ,@exceptionStack
		   ,@messageType
		   ,@messageId
           ,@messageBody
		   ,@isRawFormat)
