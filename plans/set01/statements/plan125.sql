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
                            inner join TestpassDefinition tpd (nolock) on tpd.Id = tp.TestpassDefinitionId and tpd.Name in ('BVTs Xbox One Console AMD64 FRE EN-US','ACG Phone1 HyperV x86FRE USA GSM 768x1280','Updateability P1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Restorability P1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Updateability N-1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Restorability N-1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800')
                            inner join Status s (nolock) on s.id = f.StatusId
                            inner join FailureCategory fc (nolock) on fc.id = f.FailureCategoryId
                            inner join FailureSubCategory fsc (nolock) on fsc.id = f.FailureSubCategoryId
                            inner join FailureType ft (nolock) on ft.id = f.FailureTypeId
                            inner join Reporting.Failures rf (nolock) on rf.id = f.id                            
                            inner join BuildVersion bd (nolock) on bd.Id = sch.BuildVersionId and bd.FullBuildNumber like '10007.%.fbl_sec_sa.150129-0100'
                            where f.FailureTypeId NOT IN (4,5)
                            and Status='Active'
                            order by sch.StartDate desc