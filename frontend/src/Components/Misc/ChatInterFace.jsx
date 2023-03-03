import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { getSender, getSenderObj } from "../../config/ChatLomgic"
import ProfileModal from './ProfileModal'

const ChatInterFace = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    return (
        <div>{
            selectedChat ? (<div>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} width="100%" fontFamily="Fira sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                    <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                    {!selectedChat.isGroupChat ? (<>{getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderObj(user, selectedChat.users)} />
                    </>) : (
                        <div>{selectedChat.chatName.toUpperCase()}</div>
                    )}
                </Text>
                <Box display="flex" flexDir="column" justifyContent="flex-end"
                    p={3} w="100%" h="100%" borderRadius="lg" overflowY="hidden" background="#E8E8E8"
                ></Box>
            </div>) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" fontFamily="Fira sans" pb={3}>
                        Click On a Particular Chat to Start Chatting!
                    </Text>
                </Box>
            )
        }</div>
    )
}

export default ChatInterFace