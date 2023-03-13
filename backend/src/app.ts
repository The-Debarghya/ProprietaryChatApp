/**
 * @author @The-Debarghya
 * @license AGPL
 */
import {Server, Socket} from "socket.io";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import connectDb from "./config/database.js";
import usrRoutes from "./routes/usrRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { errorHandler, notFound } from "./middlewares/errorHandlers.js";
dotenv.config();
connectDb()

const app: express.Application = express()

const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

app.use('/api/user', usrRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound)
app.use(errorHandler)

const server = app.listen(port, (): void => {
    console.log(`Server is up and running at ::${port}`)
})

interface ISocket extends Socket {
    name?: string,
    userId?: string
}

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    }
})

io.on("connection", (socket: ISocket) => {
    console.log("Connected to Socket.io Successfully!")

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log(`User Joined Room: ${room}`)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on('new message', (receivedNewMessage) => {
        var chat = receivedNewMessage.chat

        if (!chat.users) {
            console.log("Chat.users is not defined!")
            return
        }

        chat.users.forEach((user:any) => {
            if (user._id == receivedNewMessage.sender._id) {
                return
            }
            socket.in(user._id).emit("message received", receivedNewMessage)
        })
    })

    
    socket.on("offline-status", (userId) => {
        const data = {
            username: userId,
            isActive: false
        }
        socket.broadcast.emit("online-status", data)
    })
    
    socket.on("disconnect", () => {
        console.log("User gone offline! " + socket.id)
    })

    socket.on("online-status", (data) => {
        socket.broadcast.emit("online-status", data)
    })

    socket.off("setup", (userData) => {
        console.log("User Disconnected!")
        socket.leave(userData._id)
    })
})
