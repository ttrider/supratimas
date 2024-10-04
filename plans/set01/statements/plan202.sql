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
                            inner join TestpassDefinition tpd (nolock) on tpd.Id = tp.TestpassDefinitionId and tpd.Name in ('BVTs Xbox One Console AMD64 FRE EN-US','ACG Phone1 HyperV x86FRE USA GSM 768x1280','Updateability P1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Restorability P1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Updateability N-1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Restorability N-1 QRD8x26 ARMFRE QPS-PLOC GSM 480x800','BSP-CTP 8226MoneyPenny 3G NA ARMFRE QPS-PLOC GSM 480x800','BSP-CTP QRD8x26 ARMFRE QPS-PLOC GSM 480x800','BSP-CTP Location QRD8x26 ARMFRE QPS-PLOC GSM 480x800','BSP-CTP VCS QRD8x26 ARMFRE QPS-PLOC GSM 480x800','BSP-CTP_CDMA_INSERTED 8974Fluid ARMFRE USA CDMA 480x800','BSP-CTP_GSM_INSERTED 8974Fluid ARMFRE USA GSM 480x800','BSP-CTP_GSM_GSM_EMPTY_EMPTY QRD8x26 ARMFRE QPS-PLOC GSM_GSM 480x800','BSP-CTP_GSM_GSM_INSERTED_EMPTY QRD8x26 ARMFRE QPS-PLOC GSM_GSM 480x800','BSP-CTP_GSM_GSM_EMPTY_INSERTED QRD8x26 ARMFRE QPS-PLOC GSM_GSM 480x800','BSP-CTP_GSM_GSM_INSERTED_INSERTED QRD8x26 ARMFRE QPS-PLOC GSM_GSM 480x800','BSP-CTP_GSM+GSM_INSERTED_INSERTED QRD8x26 ARMFRE QPS-PLOC GSM+GSM 480x800','BSP-4HR_CTP_GSM_GSM_INSERTED_INSERTED QRD8x26 ARMFRE QPS-PLOC GSM_GSM 480x800','BSP-CTP_GSM_INSERTED QRD8x26 ARMFRE QPS-PLOC GSM 480x800','Stress Longhaul App Cycle 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800,Stress Longhaul Free Roam 8226MoneyPenny_3G ARMFRE QPS-PLOC GSM 480x800','Stress Longhaul App Cycle QRD8x26 ARMFRE QPS-PLOC GSM 480x800,Stress Longhaul Free Roam QRD8x26 ARMFRE QPS-PLOC GSM 480x800')
                            inner join Status s (nolock) on s.id = f.StatusId
                            inner join FailureCategory fc (nolock) on fc.id = f.FailureCategoryId
                            inner join FailureSubCategory fsc (nolock) on fsc.id = f.FailureSubCategoryId
                            inner join FailureType ft (nolock) on ft.id = f.FailureTypeId
                            inner join Reporting.Failures rf (nolock) on rf.id = f.id                            
                            inner join BuildVersion bd (nolock) on bd.Id = sch.BuildVersionId and bd.FullBuildNumber like '10007.%.fbl_partner_qc.150129-0100'
                            where f.FailureTypeId NOT IN (4,5)
                            and Status='Active'
                            order by sch.StartDate desc