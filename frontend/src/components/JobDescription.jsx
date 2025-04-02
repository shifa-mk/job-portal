import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Building,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleJob = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const job = res.data.job;
          dispatch(setSingleJob(job));

          // Check if user has already applied
          const hasApplied = job.applications?.some(
            (app) => app.applicant?._id === user?._id
          );
          console.log("Application check:", {
            hasApplied,
            applications: job.applications,
            userId: user?._id,
          });
          setIsApplied(hasApplied);
        }
      } catch (error) {
        console.error("Job fetch error:", error);
        toast.error("Failed to fetch job details");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId && user?._id) {
      fetchSingleJob();
    }
  }, [jobId, user?._id, dispatch]);

  const applyJobHandler = async () => {
    if (!user?._id) {
      toast.error("Please login to apply");
      return;
    }

    if (isApplied) {
      toast.warning("You have already applied for this job");
      return;
    }

    setIsApplying(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { jobId }, // Include jobId in request body
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setIsApplied(true);
        // Update Redux store with new application
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...(singleJob.applications || []),
              { applicant: { _id: user._id } },
            ],
          })
        );
        toast.success("Successfully applied for the job!");
      }
    } catch (error) {
      console.error("Application error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded w-full"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-bold text-2xl text-gray-900">
              {singleJob?.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {singleJob?.company?.name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {singleJob?.location}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Briefcase className="w-4 h-4" />
                {singleJob?.jobType}
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                <DollarSign className="w-4 h-4" />
                {singleJob?.salary} LPA
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Users className="w-4 h-4" />
                {singleJob?.postion} Positions
              </Badge>
            </div>
          </div>

          {/* Updated Application Status Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            {isApplied ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Already Applied</span>
              </div>
            ) : (
              <Button
                onClick={applyJobHandler}
                disabled={isApplying}
                className="w-full md:w-auto bg-[#7209b7] hover:bg-[#5f32ad]"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Job Description</h2>
          <div className="prose max-w-none text-gray-600">
            {singleJob?.description}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Requirements</h2>
            <div className="space-y-2 text-gray-600">
              <p>• {singleJob?.experience} years of experience</p>
              {/* Add more requirements if available */}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Additional Information</h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                Total Applicants: {singleJob?.applications?.length || 0}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                Posted: {new Date(singleJob?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
