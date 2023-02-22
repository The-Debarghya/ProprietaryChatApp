import express from "express";
import {registerUser, authenticateUser} from "../controllers/userController.js";

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(authenticateUser);

export default router;