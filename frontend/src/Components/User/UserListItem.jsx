import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const UserListItem = ({ user, handleFunction }) => {

    return (
        <Box onClick={handleFunction} cursor="pointer" bg="cyan.50" w="100%" d="flex" alignItems="center" color="black" px={3} py={2} mb={2} borderRadius="lg"
            _hover={{
                background: "#0BC5EA",
                color: "white"
            }}
        >
            <Avatar mr={2} size="sm" cursor="pointer" src={user.pic} name={user.name} />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs"><b>Email: </b>{user.email}</Text>
            </Box>
        </Box>
    )
}

export default UserListItem