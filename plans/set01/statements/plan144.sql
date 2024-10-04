SELECT size / 128.0 as fileSize, 
 FILEPROPERTY(name, 'SpaceUsed') / 128.0 as fileUsed, 
 CASE WHEN max_size = -1 OR max_size = 268435456 THEN -1 ELSE max_size / 128 END as fileMaxSize, 
 CASE WHEN growth = 0 THEN 0 ELSE 1 END as IsAutoGrow, 
 is_percent_growth as isPercentGrowth, 
 growth as fileGrowth, 
 physical_name 
 FROM sys.master_files WITH (NOLOCK) 
 WHERE type = 0 AND is_read_only = 0 AND data_space_id = 3
   AND database_id = 6