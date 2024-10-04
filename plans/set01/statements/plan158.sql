select 
                                    f.FailureTypeId,
                                    t.IsRerunPrimary                                  
                                    from Failure f (nolock)                            
									inner join Status s (nolock) on s.id = f.StatusId		
                                    inner join Teu t (nolock) on t.Id = f.TEUId 							
                                    where f.id in (11949736,12106337,17051874,17051872,17051860,17051805,17051795,17051769,17051760,17051759,17051782,17051825)and s.Status = 'Active'