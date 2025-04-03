import express from "express";
import multer from "multer";
import isAuthenciated from "../middlewares/isAuthenciated.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.cont.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images are allowed!"), false);
    } else {
      cb(null, true);
    }
  },
});

const router = express.Router();

router.post(
  "/register",
  isAuthenciated,
  upload.single("logo"),
  registerCompany
);
router.get("/get", isAuthenciated, getAllCompanies);
router.get("/get/:id", isAuthenciated, getCompanyById);
router.put("/update/:id", isAuthenciated, upload.single("logo"), updateCompany);

export default router;
