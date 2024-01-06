import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { getSender, getSenderId, getSenderObj } from "../../config/ChatLomgic"
import ProfileModal from './ProfileModal'
import UpdateModal from './UpdateModal'
import axios from 'axios'
import io from 'socket.io-client'
import ScrollableChat from './ScrollableChat'
import { BeatLoader } from 'react-spinners'
import { MdSend } from 'react-icons/md'
import { StyledEngineProvider, createTheme, ThemeProvider } from '@mui/material/styles';
import Badge from '@mui/material/Badge'
import { Avatar, Tooltip } from '@mui/material'

const ENDPOINT = "http://localhost:3000"
var socket, selectedChatCompare;

const ChatInterFace = ({ fetchAgain, setFetchAgain }) => {
    const theme = createTheme({
        typography: {
            fontFamily: "Fira sans, sans-serif"
        },
    });

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([])

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

            socket.emit('join chat', selectedChat._id)
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
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])


    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                //Not the active chat so give a notification.
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id)
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

                socket.emit('new message', data)
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

    const handleSend = async () => {
        socket.emit('stop typing', selectedChat._id)
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

            socket.emit('new message', data)
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

    const typingHandler = (event) => {
        setNewMessage(event.target.value)
        if (!socketConnected) {
            return
        }

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timeOut = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var diff = timeNow - lastTypingTime
            if (diff >= timeOut && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }

        }, timeOut)
    }

    const checkOnline = async () => {
        const intervalId = setInterval(() => {
            if (socketConnected) {
                const data = {
                    username: user._id,
                    isActive: true
                }
                socket.emit("online-status", data)
            }
        }, 500)
        socket.on("online-status", (data) => {
            if (data.isActive) {
                if (data.username !== user._id && onlineUsers.indexOf(data.username) === -1) {
                    setOnlineUsers([...onlineUsers, data.username])
                }
            } else {
                console.log(`Offline ${data.username}`)
                setOnlineUsers(onlineUsers.filter((username) => username !== data.username))
            }
        })
        return intervalId
    }

    useEffect(() => {
        if (selectedChat && !selectedChat.isGroupChat) {
            const intervalId = checkOnline()
            return () => clearInterval(intervalId)
        }
    }, [selectedChat])



    return (
        <>{
            selectedChat ? (<>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} width="100%" fontFamily="Fira sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                    <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                    {!selectedChat.isGroupChat ? (<>
                        <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst>
                                <Badge variant='dot' overlap='circular' color={onlineUsers.indexOf(getSenderId(user, selectedChat.users)) > -1 ? "success": "error"} 
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}>
                                    <Tooltip title={onlineUsers.indexOf(getSenderId(user, selectedChat.users)) > -1 ? "Online":"Offline"}>
                                        <Avatar src={getSenderObj(user, selectedChat.users).profilePic} alt={getSender(user, selectedChat.users)} />
                                    </Tooltip>
                                </Badge>
                            </StyledEngineProvider>
                        </ThemeProvider>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderObj(user, selectedChat.users)} />
                    </>) : (
                        <>
                            {selectedChat.chatName}
                            <UpdateModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                        </>
                    )}
                </Text>
                <Box display="flex" flexDir="column" justifyContent="flex-end"
                    p={3} w="100%" h="100%" borderRadius="lg" overflowY="hidden" bg="#373b45"
                >
                    {loading ? (<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />) : (
                        <div key="ab556d4323fcb" className='messages' style={{ display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none" }}>
                            <ScrollableChat messages={messages} />
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping && !selectedChat.isGroupChat ? (<div style={{ display: "flex", alignItems: "left" }}>
                            <Text fontStyle="italic" color="white">{`${getSender(user, selectedChat.users)} is typing`}</Text>
                            <BeatLoader size={5} color='white' width={70} style={{ marginBottom: 15, marginLeft: 6 }} />
                        </div>) : <></>}
                        <Box display="flex" flexDir="row" justifyContent="space-evenly">
                            <Input placeholder='Type a message' variant="filled" bg="#E0E0E0" onChange={typingHandler} value={newMessage} />
                            <IconButton icon={<MdSend />} color="#abb2bf" bg="green.500" onClick={handleSend} />
                        </Box>
                    </FormControl>
                </Box>
            </>) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Text fontSize="3xl" fontFamily="Fira sans" pb={3}>
                        Click On a User to Start Chatting!
                    </Text>
                </Box>
            )
        }</>
    )
}

export { socket }
export default ChatInterFace