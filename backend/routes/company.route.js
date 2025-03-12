import express from "express";


import isAuthenciated from "../middlewares/isAuthenciated.js";
import { getAllCompanies, getCompanyById, registerCompany, updateCompany } from "../controllers/company.cont.js";

const router =express.Router();

router.route("/register").post(isAuthenciated,registerCompany);
router.route("/get").get(isAuthenciated,getAllCompanies);
router.route("/update/:id").get(isAuthenciated,getCompanyById);
router.route("/update/:id").put( isAuthenciated,updateCompany);
export default router;