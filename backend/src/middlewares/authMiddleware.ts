import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import { User } from "../models/userModel.js";
dotenv.config()
//https://siddharthac6.medium.com/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e


const authenticated = asyncHandler(async (req:Request, res, next) => {
    var token: string;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const secret: string = process.env.JWT_SECRET || ""
            const verified:any = jwt.verify(token, secret)

            req.user = await User.findById(verified.id).select("-password")
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not Authorized! Invalid Token!")
        }
    } else {
        res.status(401)
        throw new Error("Not Authorized!")
    }
})

export default authenticated