import { Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import chats from "./data/data.js";
import connectDb from "./config/database.js";
dotenv.config();
connectDb()

const app: express.Application = express()

const port = process.env.PORT
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send("express typescript")
})

app.get('/api/chat', (req: Request, res: Response) => {
    res.send(chats);
})

app.get('/api/chat/:id', (req: Request, res: Response) => {
    const singleChat = chats.find((c) => c._id === req.params.id);
    res.send(singleChat)
})

app.listen(port, (): void => {
    console.log("express typescript")
})
