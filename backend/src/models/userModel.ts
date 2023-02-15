import { model, Schema } from "mongoose";

interface UserIface{
    name: string,
    email: string,
    password: string,
    profilePic: string
}

const userSchema = new Schema<UserIface>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }
}, {timestamps: true})

const User = model<UserIface>("User", userSchema)

export default User