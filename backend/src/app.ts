import { Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import connectDb from "./config/database.js";
import usrRoutes from "./routes/usrRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"
import { errorHandler, notFound } from "./middlewares/errorHandlers.js";
dotenv.config();
connectDb()

const app: express.Application = express()

const port = process.env.PORT
app.use(cors())
app.use(express.json())

app.use('/api/user', usrRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound)
app.use(errorHandler)

app.listen(port, (): void => {
    console.log(`Server is up and running at ::${port}`)
})
