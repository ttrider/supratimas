INSERT INTO @InputMix (Id)
SELECT DISTINCT ID FROM @MixIds

-- Find earliest partition to start scaning in to reduce scans and boost perf in later queries
