SELECT fg.name as fileGroupName, 
 fg.data_space_id as fileGroupId, 
 fg.is_read_only as fileGroupReadOnly 
 FROM sys.filegroups fg WHERE type = 'FG' AND fg.is_read_only = 0 