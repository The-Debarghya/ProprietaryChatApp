import { Document, model, Schema } from "mongoose";

export interface MessageIface extends Document{
    sender: Schema.Types.ObjectId,
    content: string,
    chat: Schema.Types.ObjectId
}

const messageSchema = new Schema<MessageIface>({
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" }
}, { timestamps: true })

export const Message = model<MessageIface>("Message", messageSchema)
