import {Schema, model} from "mongoose";

interface ChatsIface{
    chatName: String,
    isGroupChat: Boolean,
    users: Schema.Types.ObjectId[],
    latestMsg: Schema.Types.ObjectId,
    groupAdmin: Schema.Types.ObjectId
}

const ChatSchema = new Schema<ChatsIface>({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMsg: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

const Chat = model<ChatsIface>("Chat", ChatSchema)

export default Chat