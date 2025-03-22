import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs } from '@/redux/jobSlice';
import axios from 'axios';

const Jobs = () => {
    const dispatch = useDispatch();
    const { allJobs, searchedQuery } = useSelector((state) => state.job);

    console.log("Redux State Jobs:", allJobs);

    const [filteredJobs, setFilteredJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/job/get", {
                    withCredentials: true  // 🔥 Automatically sends cookies
                });
    
                console.log("✅ Fetched Jobs:", response.data.jobs);
                dispatch(setAllJobs(response.data.jobs)); // Store jobs in Redux
            } catch (error) {
                console.error("❌ Failed to fetch jobs:", error.response?.data || error.message);
            }
        };
    
        fetchJobs();
    }, [dispatch]);
    
        

    useEffect(() => {
        console.log("Current Filters:", searchedQuery);
        console.log("All Jobs Before Filtering:", allJobs);

        if (!allJobs?.length) {
            console.warn("⚠️ No jobs available for filtering.");
            setFilteredJobs([]);
            return;
        }

        const filtered = allJobs.filter(job =>
            (!searchedQuery.location || job.location?.toLowerCase()?.includes(searchedQuery.location.toLowerCase())) &&
            (!searchedQuery.industry || job.industry?.toLowerCase()?.includes(searchedQuery.industry.toLowerCase())) &&
            (!searchedQuery.salary || (job.salary && job.salary <= parseInt(searchedQuery.salary.split("-")[1])))
        );
        
        console.log("✅ Filtered Jobs:", filtered);
        setFilteredJobs(filtered);
    }, [searchedQuery, allJobs]);

    return (
        <div className='w-full'>
            {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    <div key={job._id} className='p-4 border-b'>
                        <h2 className='text-xl font-bold'>{job.title}</h2>
                        <p className='text-sm text-gray-600'>{job.location} - {job.industry}</p>
                        <p className='text-sm font-semibold'>{job.salary ? `$${job.salary}` : "Salary not specified"}</p>
                    </div>
                ))
            ) : (
                <p className='text-center text-gray-500'>No jobs found matching your criteria</p>
            )}
        </div>
    );
};

export default Jobs;

