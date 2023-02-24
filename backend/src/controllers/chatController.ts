import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import Chat from '../models/chatModel'
import { User } from '../models/userModel'

const accessChat = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    if (!userId) {
        console.log("User ID not sent in request body!")
        res.sendStatus(400)
    }

    var eachChat: any = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],

    }).populate("users", "-password").populate("latestMsg")

    eachChat = await User.populate(eachChat, {
        "path": "latestMsg.sender",
        "select": "name profilePic email",
    })

    if (eachChat.length > 0) {
        res.send(eachChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)

            const allChats = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(200).send(allChats)
        }
        catch (error) {
            res.status(500);
            throw new Error(`Error occurred:${error}`);
        }
    }
})

const fetchAllChats = asyncHandler(async (req: Request, res: Response) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password").populate("groupAdmin", "-password").populate("latestMsg")
            .sort({ updatedAt: -1 })
            .then(async (results: any) => {
                results = await User.populate(results, {
                    "path": "latestMsg.sender",
                    "select": "name profilePic email",
                })
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(500);
        throw new Error(`Error occurred:${error}`);
    }
})

const createGrpChat = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.body.users || !req.body.name) {
        res.status(400).send({ message: "Empty Request!" })
        return
    }

    var users = JSON.parse(req.body.users)
    if (users.length < 2) {
        res.status(400).send({ message: "Add at least 2 members to a group chat!" })
        return
    }
    users.push(req.user)
    try {
        const grpChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGrpChat = await Chat.findOne({ _id: grpChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

        res.status(200).json(fullGrpChat)
    } catch (error) {
        res.status(500);
        throw new Error(`Error occurred:${error}`);
    }

})

const renameGrp = asyncHandler(async (req: Request, res: Response) => {
    const { chatId, chatName } = req.body
    const newChatName = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
        .populate("users", "-password").populate("groupAdmin", "-password")

    if (!newChatName) {
        res.status(404)
        throw new Error("Requested Chat Not Found!")
    } else {
        res.status(200).json(newChatName)
    }
})

const addToGrp = asyncHandler(async (req: Request, res: Response) => {
    const { chatId, userId } = req.body
    const addedGrp = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password").populate("groupAdmin", "-password")

    if (!addedGrp) {
        res.status(404)
        throw new Error("Requested Chat Not Found!")
    } else {
        res.status(200).json(addedGrp)
    }
})

const removeFromGrp = asyncHandler(async (req: Request, res: Response) => {
    const { chatId, userId } = req.body
    const removedGrp = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password").populate("groupAdmin", "-password")

    if (!removedGrp) {
        res.status(404)
        throw new Error("Requested Chat Not Found!")
    } else {
        res.status(200).json(removedGrp)
    }
})

export { addToGrp, accessChat, fetchAllChats, createGrpChat, renameGrp, removeFromGrp }