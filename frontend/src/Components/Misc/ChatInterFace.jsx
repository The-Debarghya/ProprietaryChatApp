import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { getSender, getSenderObj } from "../../config/ChatLomgic"
import ProfileModal from './ProfileModal'
import UpdateModal from './UpdateModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'

const ChatInterFace = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMessage, setNewMessage] = useState()

    const toast = useToast()

    const fetchMessages = async () => {
        if (!selectedChat) {
            return
        }
        try {
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setloading(true)
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, headers)
            setMessages(data)
            setloading(false)
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
        fetchMessages()
    }, [selectedChat])


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const headers = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, headers)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Unexpected Error Occurred!",
                    description: "Error occurred while sending message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                })
            }
        }
    }
    const typingHandler = (event) => {
        setNewMessage(event.target.value)
    }

    return (
        <div>{
            selectedChat ? (<div>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} width="100%" fontFamily="Fira sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                    <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                    {!selectedChat.isGroupChat ? (<>{getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderObj(user, selectedChat.users)} />
                    </>) : (
                        <div>
                            {selectedChat.chatName}
                            <UpdateModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                        </div>
                    )}
                </Text>
                <Box display="flex" flexDir="column" justifyContent="flex-end"
                    p={3} w="100%" h="100%" borderRadius="lg" overflowY="hidden" background="#E8E8E8"
                >
                    {loading ? (<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />) : (
                        <div key="ab556d4323fcb" className='messages' style={{ display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none"}}>
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input placeholder='Type a message' variant="filled" bg="#E0E0E0" onChange={typingHandler} value={newMessage} />
                    </FormControl>
                </Box>
            </div>) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" fontFamily="Fira sans" pb={3}>
                        Click On a User to Start Chatting!
                    </Text>
                </Box>
            )
        }</div>
    )
}

export default ChatInterFace