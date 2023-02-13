import { Request, Response, NextFunction } from "express";
import express from "express";
import * as dotenv from "../node_modules/dotenv/lib/main";
dotenv.config();

const app: express.Application = express()

const port = process.env.PORT

app.get('/', (req: Request, res: Response) => {
    res.send("express typescript")
})

app.listen(port, (): void => {
    console.log("express typescript")
})