import { Box } from '@chakra-ui/react'
import React from 'react'
import {ChatState} from '../../Context/ChatProvider'
import ChatInterFace from './ChatInterFace'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat } = ChatState()
  return (
    <Box display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center" flexDir="column"
      padding={3}
      background="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg" borderWidth="1px"
    >
      <ChatInterFace fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox