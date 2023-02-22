import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import * as dotenv from "dotenv";
dotenv.config()

const generateToken = (id: Types.ObjectId) => {
    const jwtsecret: string = process.env.JWT_SECRET || ""
    return jwt.sign({id}, jwtsecret, {
        expiresIn: "2d",
    })
}

export default generateToken