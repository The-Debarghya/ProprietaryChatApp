import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

const defaultProfilePic: string = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Missing Fields!")
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400);
        throw new Error("Email already exists!")
    }

    const user = await User.create({ name: name, email: email, password: password, profilePic: pic || defaultProfilePic })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.profilePic,
            token: generateToken(user._id),
        })
    } else {
        res.status(500)
        throw new Error("Failed to create new user!")
    }
})

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")
    if (user) {
        const auth = await user.validatePassword(password)
        if (auth) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.profilePic,
                token: generateToken(user._id),
            })
        }
    }
})

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const searchKey = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {}

    const users = await User.findOne(searchKey).find({_id: {$ne: req.user._id}});
    res.send(users)
})

export { registerUser, authenticateUser, getAllUsers };
