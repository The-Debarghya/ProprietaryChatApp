import { model, Schema } from "mongoose";

interface MessageIface{
    sender: Schema.Types.ObjectId,
    content: String,
    chat: Schema.Types.ObjectId
}

const messageSchema = new Schema<MessageIface>({
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" }
}, { timestamps: true })

const Message = model<MessageIface>("Message", messageSchema)

export default Message