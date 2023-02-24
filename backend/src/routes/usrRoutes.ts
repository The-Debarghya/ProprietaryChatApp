import express from "express";
import {registerUser, authenticateUser, getAllUsers} from "../controllers/userController.js";
import authenticated from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/').post(registerUser).get(authenticated,getAllUsers);
router.route('/login').post(authenticateUser);

export default router;