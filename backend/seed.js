import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Job } from "./models/job.model.js"; // Adjust the path if needed

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string (update if necessary)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/job-portal";

// Read and parse job data from the JSON file
const jobsDataPath = path.join(__dirname, "data", "jobs.json");
const jobsData = JSON.parse(fs.readFileSync(jobsDataPath, "utf-8"));

// Transform the data to match the schema types
const transformedJobsData = jobsData.map((job) => {
  return {
    ...job,
    salary: Number(job.salary),
    experience: isNaN(parseInt(job.experience)) ? 0 : parseInt(job.experience),
    position: isNaN(parseInt(job.position)) ? 0 : parseInt(job.position),
  };
});

const seedJobs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Optional: Clear existing job data
    await Job.deleteMany({});
    console.log("Existing jobs cleared");

    // Insert the transformed job data into the database
    const createdJobs = await Job.insertMany(transformedJobsData);
    console.log(`Inserted ${createdJobs.length} jobs`);

    // Exit process on success
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs:", error);
    process.exit(1);
  }
};

seedJobs();
