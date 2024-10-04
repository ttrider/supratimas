INSERT INTO @statusCount(Id, Value)
        SELECT S.Id, S.Value
        FROM
        (
            -- Find uploaded status counts of 'primary' TEUs in TED.
            SELECT P.StatusId AS Id, COUNT(1) AS Value
            FROM dbo.View_PrimaryTeu AS P WITH (NOLOCK)
            WHERE P.ResolvedTEDId = @resolvedTedIntId
            GROUP BY P.StatusId

            UNION

            -- Calculate failed count of 'primary' TEUs in TED. Use an artificial Id for the calculated state.
            SELECT @calculatedFailedStatusId AS Id, COUNT(1) AS Value
            FROM dbo.View_PrimaryTeu AS P WITH (NOLOCK)
            WHERE P.ResolvedTEDId = @resolvedTedIntId
            AND 
            (
                P.HasExecutionFailures = 1 
                OR P.StatusId = @cancelledStatusId
            )
        ) AS S;
    