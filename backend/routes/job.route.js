import express from "express";
import isAuthenciated from "../middlewares/isAuthenciated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.cont.js";

const router = express.Router();

router.route("/post").post(isAuthenciated, postJob);
router.route("/get").get(getAllJobs); // Removed isAuthenciated
router.route("/getadminjobs").get(isAuthenciated, getAdminJobs);
router.route("/get/:id").get(isAuthenciated, getJobById);

export default router;
