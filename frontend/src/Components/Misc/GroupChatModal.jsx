import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../User/UserListItem'

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
    const handleSubmit = () => {

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

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
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