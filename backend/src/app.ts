import { Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import chats from "./data/data.js";
import connectDb from "./config/database.js";
import usrRoutes from "./routes/usrRoutes.js"
import { errorHandler, notFound } from "./middlewares/errorHandlers.js";
dotenv.config();
connectDb()

const app: express.Application = express()

const port = process.env.PORT
app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send("express typescript")
})

app.use('/api/user', usrRoutes);

app.use(notFound)
app.use(errorHandler)

app.listen(port, (): void => {
    console.log(`Server is up and running at ::${port}`)
})
