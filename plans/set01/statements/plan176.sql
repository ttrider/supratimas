INSERT INTO @tempTasks (TaskName)
SELECT [String] from dbo.Function_Split(@TaskNames, ';')

