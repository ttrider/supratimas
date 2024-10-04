INSERT INTO MachineSetAction (MachineSetActionTypeId, MachineSetId,
								  InvokedBy,InvokedTime,Details, IsSuccess)
			VALUES(@MachineSetActionTypeId,@MachineSetId,
				   @InvokedBy,@InvokedTime,@Details,@IsSuccess)				 
