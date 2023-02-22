import { model, Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

interface UserIface extends Document{
    name: string,
    email: string,
    password: string,
    profilePic: string,
    validatePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<UserIface>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }
}, {timestamps: true})

userSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.pre<UserIface>('save', async function(next) {
    if (!this.isModified) {
        next()
    }

    const salt = await bcrypt.genSalt(15);
    this.password = await bcrypt.hash(this.password, salt)
})

export const User = model<UserIface>("User", userSchema)
