
// Home.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import Footer from './shared/Footer';
import useGetAllJobs from '@/components/hooks/useGetAllJobs';
console.log("✅ Home Component Loaded!"); // This should be visible in the console

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  console.log("User from Redux:", user); // Check what's inside "user"
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        navigate('/admin/companies');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
};

export default Home;
