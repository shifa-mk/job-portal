import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const url = `${JOB_API_END_POINT}/get?keyword=${searchedQuery || ""}`;
        console.log("Fetching jobs from:", url);
        const res = await axios.get(url); // Removed withCredentials
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
  }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;
