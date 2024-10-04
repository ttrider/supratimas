select 
                            f.Id,                            
                            s.Status,
                            rf.CreateDateTime,                            
                            f.AssignedTo,
                            bd.Timestamp BuildDate,
                            bd.FullBuildNumber,
                            bd.Id BuildVersionID,
                            tpd.Id TestPassDefinationID,
                            f.ScheduleId
                            from Failure f (nolock)
                            inner join ScheduleTestpassMapping stpm (nolock) on stpm.ScheduleId = f.ScheduleId
                            inner join Schedule sch (nolock) on sch.id = stpm.ScheduleId
                            inner join Teu t (nolock) on t.Id = f.TEUId 
                            inner join Testpass tp (nolock) on tp.id = stpm.TestpassId and tp.IsValid = 1 and tp.IsOfficial = 1 
                            inner join TestpassDefinition tpd (nolock) on tpd.Id = tp.TestpassDefinitionId and tpd.Name in ('BVTs Xbox One Console AMD64 FRE EN-US','ACG Phone1 HyperV x86FRE USA GSM 768x1280','Updateability P1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Restorability P1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Updateability N-1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Restorability N-1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','WinPerf AppLifeCycle 8226MoneyPenny 3G ARMFRE','WinPerf Desktop AMD64 fre','Winperf BVT CTP 8926MoneyPenny_LTE ARMFRE QPS-PLOC GSM 480x800','Winperf BVT CTP Desktop AMD64 FRE','Winperf BVT CTP HyperV x86fre QPS-PLOC GSM 768x1280','Winperf Idle CTP OneCoreUAPTest AMD64 FRE','Winperf Workloads BVT CTP Desktop X86 FRE','Stress Longhaul App Cycle HyperV x86FRE QPS-PLOC GSM 768x1280,Stress Longhaul Free Roam HyperV x86FRE QPS-PLOC GSM 768x1280','Stress Longhaul App Cycle 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800,Stress Longhaul Free Roam 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800','Stress Longhaul App Cycle QRD8x26 ARMFRE QPS-PLOC GSM 480x800,Stress Longhaul Free Roam QRD8x26 ARMFRE QPS-PLOC GSM 480x800')
                            inner join Status s (nolock) on s.id = f.StatusId
                            inner join FailureCategory fc (nolock) on fc.id = f.FailureCategoryId
                            inner join FailureSubCategory fsc (nolock) on fsc.id = f.FailureSubCategoryId
                            inner join FailureType ft (nolock) on ft.id = f.FailureTypeId
                            inner join Reporting.Failures rf (nolock) on rf.id = f.id                            
                            inner join BuildVersion bd (nolock) on bd.Id = sch.BuildVersionId and bd.FullBuildNumber like '10006.%.fbl_swat_dev02.150129-0155'
                            where f.FailureTypeId = 4
                            and Status='Active'
                            order by sch.StartDate desc