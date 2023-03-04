import { InfoIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../User/UserBadgeItem'
import UserListItem from '../User/UserListItem'

const UpdateModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState()

    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingRename, setLoadingRename] = useState(false)

    const toast = useToast()

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User Already Added!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can perform the action!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setloading(true)
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/adduser', {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, headers)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoadingRename(false)
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            setloading(false)
        }
        setGroupChatName("")
    }
    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setloading(true);
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/removeuser`,{
                    chatId: selectedChat._id,
                    userId: userToRemove._id,
                },headers);

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setloading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
        }
        setGroupChatName("")
    }
    const handleRename = async () => {
        if (!groupChatName) {
            return
        }
        try {
            setLoadingRename(true)
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/rename', {
                chatId: groupChatName._id,
                chatName: groupChatName
            }, headers)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoadingRename(false)
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            setLoadingRename(false)
        }
        setGroupChatName("")
    }
    const handleSearch = async (searchQuery) => {
        setSearch(searchQuery)
        if (!searchQuery) {
            return
        }

        try {
            setloading(true)
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, headers)
            setloading(false)
            setSearchResults(data)
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: "Error occurred while searching for users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
    }

    return (
        <div>
            <IconButton display={{ base: "flex" }} icon={<InfoIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" justifyContent="center" fontSize="35px" fontFamily="Fira sans">
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => {
                                return (<UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />)
                            })}
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant="solid" colorScheme="whatsapp.400" ml={1}
                                isLoading={loadingRename}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add User" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResults?.map((u) => {
                                return (<UserListItem key={u._id} user={u} handleClick={() => handleAddUser(u)} />)
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateModal