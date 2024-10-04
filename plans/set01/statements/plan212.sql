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
                            inner join Teu t (nolock) on t.Id = f.TEUId and t.IsRerunPrimary = 1
                            inner join Testpass tp (nolock) on tp.id = stpm.TestpassId and tp.IsValid = 1 and tp.IsOfficial = 1
                            inner join TestpassDefinition tpd (nolock) on tpd.Id = tp.TestpassDefinitionId and tpd.Name in ('Canary HyperV x86CHK QPS-PLOC GSM 768x1280 TEST','Canary HyperV x86FRE QPS-PLOC GSM 768x1280 TEST','Canary 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800 Test','Canary QRD8x26 ARMFRE QPS-PLOC GSM 480x800 Test','WinBVT CLIENT - ENTERPRISE-AMD64-FRE-EN-US','WinBVT CLIENT - ENTERPRISE-X86-FRE-EN-US','WinBVT SERVER - SERVER-AMD64-FRE-EN-US','WinBVT CORESYSTEMSERVER-AMD64-FRE-EN-US','BITS HyperV x86FRE QPS-PLOC GSM 768x1280','BITS HyperV x86CHK QPS-PLOC GSM 768x1280','BITs 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800','BITS QRD8x26 ARMFRE QPS-PLOC GSM 480x800','WinBVT AnalogOneCore-x86-FRE-EN-US','WinBVT OneCoreTest-AMD64-FRE-EN-US','WinBVT OneCoreTest-X86-FRE-EN-US','WinBVT OneCoreUAPTest-AMD64-FRE-EN-US','WinBVT OneCoreUAPTest-X86-FRE-EN-US','SPG PGO-8P-C00 - DataCenter - AMD64-FRE-EN-US','Selfhostx64','AC_LCR_x86','AppCompat4x64','AppCompat6x64','AppCompat5x64','AppCompat1x86','AppCompat2x86','AppCompat1x64','AppCompat7x64','AppCompat3x64','AppCompat2x64','AC_LCR_x64','Updateability P1 HyperV x86FRE QPS-PLOC GSM 768x1280','Restorability P1 HyperV x86FRE QPS-PLOC GSM 768x1280','Updateability N-1 HyperV x86FRE QPS-PLOC GSM 768x1280','Restorability N-1 HyperV x86FRE QPS-PLOC GSM 768x1280','Updateability N-1 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800','Restorability N-1 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800','Stress Readiness HyperV x86FRE QPS-PLOC GSM 768x1280','Stress Readiness 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800','Stress Readiness QRD8x26 ARMFRE QPS-PLOC GSM 480x800')
                            inner join Status s (nolock) on s.id = f.StatusId
                            inner join FailureCategory fc (nolock) on fc.id = f.FailureCategoryId
                            inner join FailureSubCategory fsc (nolock) on fsc.id = f.FailureSubCategoryId
                            inner join FailureType ft (nolock) on ft.id = f.FailureTypeId
                            inner join Reporting.Failures rf (nolock) on rf.id = f.id                            
                            inner join BuildVersion bd (nolock) on bd.Id = sch.BuildVersionId and bd.FullBuildNumber like '10005.%.fbl_sfp_dev04.150129-0140'
                            where f.FailureTypeId NOT IN (4,5)
                            and Status='Active'
                            order by sch.StartDate desc