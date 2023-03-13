import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../User/UserListItem'
import UserBadgeItem from '../User/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setloading] = useState(false)

    const toast = useToast()
    const { user, chats, setChats } = ChatState()
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
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
            toast({
                title: "Please Specify All Fields!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }

        try {
            const headers = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            if (selectedUsers.length <= 2) {
                throw new Error("Please add at least 2 members!")
            }
            const {data} = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            }, headers)
            setChats([data, ...chats])
            onClose()
            toast({
                title: "Created New Group Chat!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        } catch (error) {
            toast({
                title: "Unexpected Error Occurred!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
    }

    const handleGroup = (member) => {
        if (selectedUsers.includes(member)) {
            toast({
                title: "Search For New Users!",
                description: "Already added the User into this Group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
        }
        setSelectedUsers([...selectedUsers, member])
    }

    const handleDelete = (tempUser) => {
        setSelectedUsers(selectedUsers.filter((selUser) => selUser._id !== tempUser._id))
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent color="#abb2bf" bg="#282c34">
                    <ModalHeader fontSize="35px" fontFamily="Fira sans" display="flex" justifyContent="center">
                        New Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input placeholder='Group Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users(At least 2)' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                        {selectedUsers?.map((u) => {
                            return (<UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />)
                        })}
                        </Box>
                        {loading ? (<Spinner size="xs" />): (searchResults?.slice(0,4).map((user) => {
                            return (<UserListItem key={user._id} user={user} handleClick={() => handleGroup(user)} />)
                        }))}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="twitter" mr={3} onClick={handleSubmit}>Create Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default GroupChatModal