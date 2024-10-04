IF NOT EXISTS ( SELECT 1 FROM dbo.TEU teu WITH (NOLOCK) 
                INNER JOIN dbo.Mix mix WITH (NOLOCK) ON mix.Id = teu.MixId
                INNER JOIN dbo.[Status] [status] WITH (NOLOCK) ON teu.StatusId = [status].Id
                WHERE mix.Guid = @MixId 
                  AND ( teu.UploadComplete = 0 
                    OR ([Status].[Status] IN ('Unknown','Waiting','InProgress' ) AND [Status].[Type] = 'TEU')))
    