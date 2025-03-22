import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    
    // Initially check if user has applied
    const [isApplied, setIsApplied] = useState(false);
    
    const params = useParams();
    const jobId = params.id;
    console.log("Job ID received:", params.id);
    const dispatch = useDispatch();

    console.log("Type of jobId:", typeof jobId);
    console.log("Type of first applied job ID:", typeof isApplied[0]); // Replace with actual variable
    

    useEffect(() => {
        console.log("Checking isApplied:", singleJob?.applications, user?._id);
        setIsApplied(singleJob?.applications?.some(application => application.applicant === user?._id));
    }, [singleJob, user?._id]);
    

    const applyJobHandler = async () => {
        if (isApplied) {
            toast.warning("You have already applied for this job.");
            return;
        }
    
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, { withCredentials: true });
    
            if (res.data.success) {
                toast.success(res.data.message);
    
                // 🛠️ **Manually update Redux after applying**
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...(singleJob.applications || []), { applicant: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
    
                // ✅ **Update the state immediately**
                setIsApplied(true);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    useEffect(() => {
        console.log("Updated isApplied:", isApplied);
    }, [isApplied]);
  

    console.log("Applying for Job ID:", jobId);

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch]);
    console.log("Updated singleJob in Redux:", singleJob);
    console.log("isApplied state:", isApplied);
    
    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
            </div>
        </div>
    );
};

export default JobDescription;
