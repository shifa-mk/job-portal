import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector((state) => state.job);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Fetch jobs effect
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/job/get",
          {
            withCredentials: true,
          }
        );
        const jobs = response.data.jobs;
        console.log("Fetched jobs:", jobs);
        dispatch(setAllJobs(jobs));
        setFilteredJobs(jobs); // Initialize filtered jobs with all jobs
      } catch (error) {
        console.error("❌ Failed to fetch jobs:", error);
      }
    };
    fetchJobs();
  }, [dispatch]);

  // Filtering effect
  useEffect(() => {
    if (!allJobs?.length) return;

    const filtered = allJobs.filter((job) => {
      const locationMatch =
        !searchedQuery.location ||
        job.location
          ?.toLowerCase()
          .includes(searchedQuery.location.toLowerCase());

      // Updated industry matching logic
      const industryMatch =
        !searchedQuery.industry ||
        job.title?.toLowerCase() === searchedQuery.industry.toLowerCase() ||
        job.title
          ?.toLowerCase()
          .includes(searchedQuery.industry.split(" ")[0].toLowerCase());

      let salaryMatch = true;
      if (searchedQuery.salary) {
        const [min, max] = {
          "0-50k": [0, 0.5],
          "50k-1L": [0.5, 1],
          "1L-5L": [1, 5],
          "5L-10L": [5, 10],
          "10L-20L": [10, 20],
        }[searchedQuery.salary] || [0, 0];

        salaryMatch = job.salary >= min && job.salary <= max;
      }

      console.log(`Filtering job: ${job.title}`, {
        locationMatch,
        industryMatch,
        salaryMatch,
        searchIndustry: searchedQuery.industry,
        jobTitle: job.title,
      });

      return locationMatch && industryMatch && salaryMatch;
    });

    setFilteredJobs(filtered);
  }, [searchedQuery, allJobs]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-1/4">
            <FilterCard />
          </div>
          <div className="flex-1">
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[50vh]">
                <p className="text-xl text-gray-500">
                  No jobs found matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
