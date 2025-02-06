import express from "express";
import { login,register,updateProfile,logout } from "../controllers/user.cont.js";


import isAuthenciated from "../middlewares/isAuthenciated.js";

const router =express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/proile/update").post( isAuthenciated,updateProfile);
export default router;