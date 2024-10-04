INSERT  INTO dbo.TestpassDefinition
            ( Name ,
              TestpassTypeId ,
              TeamId ,
              Description
            )
            SELECT  @Name ,
                    @TestpassTypeId ,
                    @TeamId ,
                    @Description
            WHERE   NOT EXISTS ( SELECT TOP 1
                                        1
                                 FROM   dbo.TestpassDefinition
                                 WHERE  Name = @Name );

    