import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLomgic'
import { ChatState } from '../../Context/ChatProvider'

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => {
                return (<div key={m._id} style={{ display: "flex" }}>
                    {
                        (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.profilePic} />
                            </Tooltip>
                        )
                    }
                    <span style={{
                        backgroundColor: `${m.sender._id === user._id ? "#68D391" : "#90CDF4"}`,
                        borderRadius: "20px", padding: "5px 15px", maxWidth: "75%",
                        marginLeft: isSameSenderMargin(messages, m, i, user._id), marginTop: isSameUser(messages, m, i) ? 3 : 10
                    }}
                    >
                        {m.content}
                    </span>
                </div>)
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat