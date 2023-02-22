import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config()

export const notFound = (req:Request, res:Response, next:NextFunction) => {
    const error = new Error(`Page Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
} 

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    res.json({
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
    })
}