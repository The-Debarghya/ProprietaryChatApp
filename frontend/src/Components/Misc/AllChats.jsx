import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ChatLoading from './ChatLoading';

const AllChats = () => {
  const [loggedInUser, setLoggedInUser] = useState() //Local User State
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const data = await axios.get(`/api/chat`, headers)
      setChats(data)
    } catch (error) {
      toast({
        title: "Unexpected Error Occurred!",
        description: "Error occurred while fetching chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
    }
  }

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [])
  
  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
  }

  return (
    <Box d={{base: selectedChat ? "none" : "flex", md: "flex"}} flexDir="column" alignItems="center" p={3} bg="white" w={{base: "100%", md: "31%"}} borderRadius="lg" borderWidth="1px">
      <Box display="flex" alignItems="center" justifyContent="space-between" pb={3} px={3} fontSize={{base: "28px", md: "30px"}} fontFamily="Fira sans" w="100%">
        <div>All Chats</div>
        <Button d="flex" fontSize={{base: "17px", md: "10px", lg: "17px"}} rightIcon={<AddIcon/>} color="twitter.100" textColor="black">
          Create New Group
        </Button>
      </Box>
      <Box d="flex" flexDir="column" p={3} bg="twitter.50" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {/*chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              <Box onClick={() => setSelectedChat(chat)} cursor="pointer" px={3} py={2} borderRadius="lg" key={chat._id}
              bg={selectedChat === chat ? "cyan.400" : "cyan.50"} color={selectedChat === chat ? "white" : "black"}
              >
                <Text>
                  {!chat.isGroupChat ? (getSender(loggedInUser,chat.users)) : (chat.chatName)}
                </Text>
              </Box>
            })}
          </Stack>
          ) : (<ChatLoading/>)*/}
      </Box>
    </Box>
  )
}

export default AllChats