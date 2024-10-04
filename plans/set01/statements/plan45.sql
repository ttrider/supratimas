SELECT @TEUIntId = Id, @ResolvedTEDId = ResolvedTEDId, @OldUploadComplete = UploadComplete, 
            @oldPass = TCPassCount, @oldFail = TCFailCount, @oldWarn = TCWarnCount, @oldSkip = TCSkipCount, @oldBlock = TCBlockCount 
    FROM dbo.TEU
    WHERE Guid = @TEUId
    

    /*
    ** Calculate the new totals	
    */
    