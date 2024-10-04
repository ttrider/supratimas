WITH CommentList AS 
		(
			SELECT sch.Comments,
					sch.CommentAddedBy AS AddedBy,
					sch.CommentUpdateTime AS UpdateTime
			FROM dbo.Schedule AS sch WITH (NOLOCK)
			WHERE sch.Id = @ElementId
		
			UNION
			
			SELECT schComments.Comments,
					schComments.AddedBy,
					schComments.UpdateTime
			FROM dbo.ScheduleCommentHistory AS schComments WITH (NOLOCK)
			WHERE schComments.ScheduleId = @ElementId		
		)

		INSERT INTO @Comments (Comments, AddedBy, UpdateTime)		
				SELECT Comments, AddedBy, UpdateTime 
				FROM CommentList
				WHERE Comments IS NOT NULL
			
	