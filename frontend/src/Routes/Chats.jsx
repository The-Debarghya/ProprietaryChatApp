import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import AllChats from '../Components/Misc/AllChats';
import ChatBox from '../Components/Misc/ChatBox';
import SideSearch from '../Components/Misc/SideSearch';
import { ChatState } from '../Context/ChatProvider'

const Chats = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <div style={{ width: "100%" }}>
            {user && <SideSearch />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <AllChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
            </Box>
        </div>
    )
}

export default Chats