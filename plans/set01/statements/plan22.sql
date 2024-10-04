INSERT INTO @messages(MessageId)
	SELECT xmlMessage.Item.value('@Id[1]', 'BIGINT')
	FROM @xmlMessages.nodes('/Ms/M') AS xmlMessage(Item)

	