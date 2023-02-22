import { connect } from "mongoose"
import * as mongoose from "mongoose"
import * as dotenv from "dotenv"

dotenv.config()

const connectDb = async () => {
    try {
        const uri: string = process.env.MONGO_URL || ""
        const connection = await connect(uri)
        mongoose.set('strictQuery', true)
        console.log(`Mongodb Connected Successfully!`)
    } catch (error: unknown) {
        console.log(`Error:${error}`)
    }
}

export default connectDb