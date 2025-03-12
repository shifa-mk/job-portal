import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth); // Get user from Redux store

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (!user?.token) {
          console.warn('No token found, skipping API call');
          return;
        }

        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log('API Response:', res.data);

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
          console.log('Dispatched Companies:', res.data.companies);
        } else {
          console.warn('API returned success: false', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching companies:', error.response?.data || error.message);
      }
    };

    fetchCompanies();
  }, [dispatch, user]);

  return null; // Optional, if this hook doesn't need to return anything
};

export default useGetAllCompanies;
