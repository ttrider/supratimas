SELECT 
            @objectId = Id, 
            @isStopwatchEnabled = IsEnabled 
        FROM [dbo].[PerformanceLogConfiguration] (NOLOCK)
            WHERE Name = @objectName

        