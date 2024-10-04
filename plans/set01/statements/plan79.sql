UPDATE TPD
    SET RecordLastUpdated = GETDATE()
    FROM dbo.TestpassDefinition AS TPD
    INNER JOIN inserted ON tpd.Id = inserted.Id
    INNER JOIN deleted  ON tpd.Id = deleted.Id
    WHERE 
        (
                inserted.Name           <> deleted.Name
            OR  inserted.TestpassTypeId <> deleted.TestpassTypeId
        )
