SELECT  @ActiveFailureStatusId = Id 
    FROM dbo.[Status] WITH (NOLOCK)
    WHERE [Type] = 'Failure' AND 
          [Status] = 'Active'

    