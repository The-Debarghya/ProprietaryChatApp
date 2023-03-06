import { AddIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal'

const AllChats = ({fetchAgain}) => {
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
      const { data } = await axios.get(`/api/chat`, headers)
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
  }, [fetchAgain])

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
  }

  return (
    <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" alignItems="center" p={3} color="#abb2bf" bg="#282c34" w={{ base: "100%", md: "31%" }} borderRadius="lg" borderWidth="1px">
      <Box display="flex" alignItems="center" justifyContent="space-between" pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Fira sans" w="100%">
        <div>All Chats</div>
        <GroupChatModal>
          <Button display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<AddIcon />} bg="green.700" textColor="#abb2bf">
            Create New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box display="flex" flexDir="column" p={3} color="#abb2bf" bg="#373b45" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (<Box onClick={() => setSelectedChat(chat)} cursor="pointer" px={3} py={2} borderRadius="lg" key={chat._id}
                bg={selectedChat === chat ? "#56b6c2" : "#5c6370"} color={selectedChat === chat ? "white" : "#abb2bf"}
              >
                {!chat.isGroupChat ? (<Avatar src={chat.users[0]._id === user._id ? chat.users[1].profilePic : chat.users[0].profilePic} />) : (<Avatar alt={chat.chatName} src="https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo"/>)}
                <Text>
                  {!chat.isGroupChat ? (getSender(loggedInUser, chat.users)) : (chat.chatName)}
                </Text>
                {chat.latestMsg && (
                  <Text fontSize="xs">
                    <b>{chat.latestMsg.sender.name}: </b>
                    {chat.latestMsg.content.length > 50
                      ? chat.latestMsg.content.substring(0, 51) + "..."
                      : chat.latestMsg.content}
                  </Text>
                )}
              </Box>)
            })}
          </Stack>
        ) : (<ChatLoading />)}
      </Box>
    </Box>
  )
}

export default AllChats