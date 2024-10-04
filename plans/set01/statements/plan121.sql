INSERT INTO @SectionEntries
SELECT
    [Entry].value('@SectionId', 'int'),
    [Entry].value('@SectionEntryId', 'int'),
    [Entry].value('@SectionEntryName', 'nvarchar(255)'),
    [Entry].value('@Branch', 'nvarchar(100)'),
    [Entry].value('@Build', 'nvarchar(256)'),
    N'' AS TellusBuild,
    [Entry].value('@TestPassName', 'nvarchar(500)')
FROM @SectionEntryXml.nodes('//SectionEntry') AS Entries([Entry])
OPTION (OPTIMIZE FOR (@SectionEntryXml = NULL))

