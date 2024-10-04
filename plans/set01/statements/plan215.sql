insert into #QS_servicecontrol (state)
		execute sys.xp_servicecontrol N'querystate', @AgentServiceName
	