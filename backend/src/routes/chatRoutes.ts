import express from "express";
import { accessChat, addToGrp, createGrpChat, fetchAllChats, removeFromGrp, renameGrp, deleteGrpChat } from "../controllers/chatController.js";
import authenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/').post(authenticated, accessChat);
router.route('/').get(authenticated, fetchAllChats);
router.route('/group').post(authenticated, createGrpChat);
router.route("/rename").put(authenticated, renameGrp);
router.route("/adduser").put(authenticated, addToGrp);
router.route("/removeuser").put(authenticated, removeFromGrp);
router.route("/deletegrp").put(authenticated, deleteGrpChat);

export default router