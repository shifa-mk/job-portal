import { Button } from "@/components/ui/button";
import { Briefcase, Users, CheckCircle, ClipboardList, Star, FileText, BarChart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const RecruiterHeroSection = () => {
    const navigate = useNavigate();

    const postJobHandler = () => {
        navigate("/admin/jobs"); // Redirects to job posting page
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <>
            <Navbar />
            <div className="text-center px-6">
                <motion.div className="flex flex-col gap-5 my-10" initial="hidden" animate="visible" variants={fadeIn}>
                    <motion.span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium"
                        whileHover={{ scale: 1.1 }}>
                        Hire the Best Talent
                    </motion.span>
                    <h1 className="text-4xl sm:text-5xl font-bold">
                        Post Jobs & Find <br /> Top <span className="text-[#6A38C2]">Candidates</span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Connect with skilled professionals and grow your team effortlessly.
                    </p>
                    <motion.div className="w-full sm:w-[40%] shadow-lg border border-gray-200 px-3 py-2 rounded-full flex justify-center mx-auto"
                        whileHover={{ scale: 1.05 }}>
                        <Button onClick={postJobHandler} className="w-full rounded-full bg-[#6A38C2] flex items-center justify-center py-3 text-white text-lg font-medium">
                            <Briefcase className="h-6 w-6 mr-2" />
                            Post a Job
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            <div className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6">FEATURES</h2>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
                    initial="hidden" animate="visible" variants={fadeIn}>
                    {[
                        { icon: Briefcase, title: "Create Jobs", color: "text-blue-600" },
                        { icon: ClipboardList, title: "Track Applications", color: "text-green-600" },
                        { icon: CheckCircle, title: "Register Multiple Companies", color: "text-purple-600" },
                        { icon: Users, title: "Shortlisted Candidates", color: "text-red-600" },
                        { icon: Calendar, title: "Manage Interviews", color: "text-yellow-600" },
                        { icon: BarChart, title: "View Company Insights", color: "text-indigo-600" },
                        { icon: FileText, title: "Send Offer Letters", color: "text-teal-600" },
                        { icon: Star, title: "Manage Saved Candidates", color: "text-orange-600" },
                    ].map((feature, index) => (
                        <motion.div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center w-200"
                            whileHover={{ scale: 1.05 }}>
                            <feature.icon className={`h-10 w-10 ${feature.color}`} />
                            <h3 className="text-md font-semibold mt-2">{feature.title}</h3>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <Footer />
        </>
    );
};

export default RecruiterHeroSection;
