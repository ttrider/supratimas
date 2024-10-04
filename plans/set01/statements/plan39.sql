SELECT  @MixIntId = Id
        FROM    dbo.Mix WITH ( NOLOCK )
        WHERE   Guid = @mixId
    
        