UPDATE R
		    SET TeuResultLogId = NULL
	    FROM upload.TeuResult AS R
        JOIN upload.TeuResultLog AS L ON R.TeuResultLogId = L.Id
        WHERE 
            L.Processed = 0 
            AND R.UploadedDate < @orphanedLogUploadTime

	    /*
	    ** Create our log record
	    */
	    