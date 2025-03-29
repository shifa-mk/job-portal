import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                console.log('Jobs API Response:', res.data.jobs);

                if (res.data.success) {
                    // Ensure company data is included
                    const jobsWithCompanies = res.data.jobs.map((job) => ({
                        ...job,
                        company: job.company || { name: 'N/A' }  // Fallback in case company is missing
                    }));

                    dispatch(setAllAdminJobs(jobsWithCompanies)); 
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchAllAdminJobs();
    }, [dispatch]);
};

export default useGetAllAdminJobs;
