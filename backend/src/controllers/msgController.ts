import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { MessageIface, Message } from '../models/messageModel.js'
import { User } from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        console.log("Invalid content passed!")
        res.sendStatus(400)
        return
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);
        message = await message.populate([{
            path: "sender",
            select: "name pic"
        }])
        message = await message.populate([{ path: "chat" }])
        var fullData = await User.populate(message, {
            path: "chat.users",
            select: "name email pic"
        })
        await Chat.findByIdAndUpdate({
            latestMsg: fullData
        })
        res.json(fullData)
    } catch (error) {
        res.status(500)
        throw new Error("Error occurred while sending chat!")
    }
})

export const allMessages = asyncHandler(async (req:Request, res:Response) => {
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name email pic").populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(500)
        throw new Error("Error occurred while fetching chats!")
    }
})