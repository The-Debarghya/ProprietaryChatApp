import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import ProfileModal from './ProfileModal'

const SideSearch = () => {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const { user, setSelectedChat, chats, setChats } = ChatState()
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

            const data = await axios.get(`/api/user?search=${search}`, headers)
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
            const {data} = await axios.post("/api/chat", {userId}, headers)
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
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
        }
    }
    const signoutUserHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/")
    }
    return (
        <div>
            <Box d="flex" justifyContent="space-between" alignItems="center" bg="whatsapp.100" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search Users To Chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fa-solid fa-user-magnifying-glass"></i>
                        <Text d={{ base: "none", md: "flex" }} p="4px">
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Fira sans">
                    PropChat
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={signoutUserHandler}>Sign Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search or Start a New Chat</DrawerHeader>
                    <DrawerBody>
                        <Box d="flex" paddingBottom={2}>
                            <Input placeholder='Search by Name or Email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch} >Get</Button>
                        </Box>
                        {loading ? (<ChatLoading />) : (searchResults?.map(user => {
                            <UserListItem key={user._id} user={user} handleClick={()=> accessChat(user._id)} />
                        })) }
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideSearch