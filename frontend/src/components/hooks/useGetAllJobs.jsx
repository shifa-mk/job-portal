import { setAllJobs } from "@/redux/jobSlice"; // ✅ Ensure correct import

import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);
  const token = useSelector((store) => store.auth.token); // Get token from Redux

  useEffect(() => {
    const fetchAllJobs = async () => {
      if (!token) {
        console.warn("No token found, skipping API call");
        return;
      }

      try {
        const url = `${JOB_API_END_POINT}/get?keyword=${searchedQuery || ""}`;
        console.log("Fetching jobs from:", url);

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Add token here
        });

        console.log("API response:", res.data);
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        } else {
          console.warn("Response success flag false:", res.data);
        }
      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error?.response?.data?.message || error.message
        );
      }
    };
    fetchAllJobs();
  }, [dispatch, searchedQuery, token]); // ✅ Added token as dependency

};

export default useGetAllJobs;
