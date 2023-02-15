import axios from 'axios'
import React, { useEffect, useState } from 'react'

const baseUrl = "http://127.0.0.1:3000"

const Chats = () => {
    const [Chats, setChats] = useState([])

    const fetchData = async () => {
        const {data} = await axios.get(`${baseUrl}/api/chat`)
        setChats(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            {Chats.map((chat) => (
                <div key={chat._id}>{chat.chatName}</div>
            ))}
        </div>
    )
}

export default Chats