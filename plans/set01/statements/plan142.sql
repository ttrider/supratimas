INSERT INTO [dbo].[AgentLog] 
                                                ([Machine],[CreateTime],[Thread],[Category],[EntryType],[Message],[MessageId]) VALUES 
                                                ('OSGT3TSVC00', @createTime, @thread, @category, @entryType, @message, @messageId)