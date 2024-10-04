IF (
        1 = ALL
            (
                    SELECT M.TeusUploaded 
                    FROM [Reporting].[Mixes] AS M WITH (NOLOCK) 
                    WHERE M.TestpassId = @TestpassId
            )
        )
    