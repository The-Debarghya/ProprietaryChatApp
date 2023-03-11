import { BellIcon, ChatIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import ProfileModal from './ProfileModal'
import UserListItem from '../User/UserListItem'
import { MdLogout, MdOutlineInfo, MdPersonSearch } from 'react-icons/md'
import { getSender } from '../../config/ChatLomgic'
import { StyledEngineProvider, createTheme, ThemeProvider } from '@mui/material/styles';
import Badge from '@mui/material/Badge'
import {socket} from './ChatInterFace'

const SideSearch = () => {
    const theme = createTheme({
        typography: {
            fontFamily: "Fira sans, sans-serif"
        },
    });

    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
    const navigate = useNavigate()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Empty Search Query!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return
        }

        try {
            setLoading(true)
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, headers)
            setLoading(false)
            setSearchResults(data)
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: "Error occurred while fetching results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
        }
    }

    const accessChat = async (userId) => {
        setLoadingChat(true)
        try {

            const headers = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("/api/chat", { userId }, headers)
            /** Ignore already added chats */
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats])
            }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
        }
    }
    const signoutUserHandler = () => {
        localStorage.removeItem("userInfo")
        socket.emit("offline-status", user._id)
        socket.disconnect()
        navigate("/")
    }
    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="space-between" color="#abb2bf" bg="#282c34" borderColor="#282c34" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users To Chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <MdPersonSearch />
                        <Text display={{ base: "none", md: "flex" }} p="4px">
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="4xl" fontFamily="Fira sans" fontStyle="bold">
                <ChatIcon color="#abb2bf" boxSize="9" pb={5} />
                    PropChat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <ThemeProvider theme={theme}>
                                <StyledEngineProvider injectFirst>
                                    <Badge badgeContent={notification.length} color="primary" max={9}>
                                        <BellIcon fontSize="lg" m={8} />
                                    </Badge>
                                </StyledEngineProvider>
                            </ThemeProvider>
                        </MenuButton>
                        <MenuList pl={3} color="white" bg="#6e6e80">
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => {
                                return (<MenuItem bg="#6e6e80" key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif))
                                }}>
                                    {notif.chat.isGroupChat ? `New Messages in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>)
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList bg="white" color="#6e6e80">
                            <ProfileModal user={user}>
                                <MenuItem>
                                <MdOutlineInfo />
                                Profile
                                </MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={signoutUserHandler}>
                                <MdLogout />
                                Sign Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
                <DrawerOverlay />
                <DrawerContent color="#abb2bf" bg="#282c34">
                    <DrawerHeader borderBottomWidth="1px">Search or Start a New Chat</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" paddingBottom={2}>
                            <Input placeholder='Name or Email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch} color="white" bg="twitter.500">Search</Button>
                        </Box>
                        {loading ? (<ChatLoading />) : (searchResults?.map((user) => {
                            return <UserListItem key={user._id} user={user} handleClick={() => accessChat(user._id)} />
                        }))}
                        {loadingChat && <Spinner ml="auto" display="flex" color='#abb2bf' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideSearch