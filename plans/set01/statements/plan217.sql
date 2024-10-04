SELECT bv.BuildString
FROM dbo.BuildVersion bv WITH (NOLOCK)
WHERE bv.Branch = @Branch
    AND bv.BuildNo <= @BuildNo
    AND bv.IsPrivateBuild = 0
ORDER BY bv.BuildNo, bv.[Timestamp], bv.Revision