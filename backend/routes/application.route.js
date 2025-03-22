import express from "express";


import isAuthenciated from "../middlewares/isAuthenciated.js";


import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.cont.js";

const router =express.Router();

router.route("/apply/:id").post(isAuthenciated,applyJob);
router.route("/get").get(isAuthenciated,getAppliedJobs);
router.route("/:id/applicants").get(isAuthenciated,getApplicants);
router.route("/status/:id/update").put( isAuthenciated,updateStatus);
export default router;