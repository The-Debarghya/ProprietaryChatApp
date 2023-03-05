import express from "express";
import authenticated from "../middlewares/authMiddleware.js";
import {allMessages, sendMessage} from '../controllers/msgController.js'

const router = express.Router()

router.route('/').post(authenticated, sendMessage)
router.route('/:chatId').get(authenticated, allMessages)

export default router