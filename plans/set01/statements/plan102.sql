INSERT INTO @Tokens SELECT String AS [Token], StartIndex AS [StartIndex] FROM dbo.Function_Split(@StringParse, @Separator);
            
            