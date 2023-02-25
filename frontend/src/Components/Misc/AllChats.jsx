import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const AllChats = () => {

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  return (
    <div>AllChats</div>
  )
}

export default AllChats