DECLARE c1 CURSOR FAST_FORWARD
	FOR
	SELECT R.TeuId
	FROM upload.TeuResult AS R
	INNER JOIN upload.TeuResultLog AS RL ON RL.Id = R.TeuResultLogId
	WHERE RL.Id = @logId AND R.TeuId IS NOT NULL

	/*
	** Recalc the pass\fail summaries for each Teu
	*/
	