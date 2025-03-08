import express from "express";
import { login,register,updateProfile,logout } from "../controllers/user.cont.js";


import isAuthenciated from "../middlewares/isAuthenciated.js";
import { singleUpload } from "../middlewares/multer.js";

const router =express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/proile/update").post( isAuthenciated,singleUpload,updateProfile);
export default router;