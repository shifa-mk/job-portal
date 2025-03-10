import express from "express";
import { login,register,updateProfile,logout } from "../controllers/user.cont.js";


import isAuthenciated from "../middlewares/isAuthenciated.js";
import { singleUpload } from "../middlewares/multer.js";

const router =express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post( isAuthenciated,singleUpload,updateProfile);
router.route("/me").get(isAuthenciated, (req, res) => {
  if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
  }
  res.status(200).json({ user: req.user });
});

export default router;