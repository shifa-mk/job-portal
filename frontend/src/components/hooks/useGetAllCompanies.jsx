import companySlice from "@/redux/companySlice"; 
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.company);
  const token = useSelector((store) => store.auth.token); 

  useEffect(() => {
    const fetchAllCompanies = async () => {
      console.log("Token before API call:", token); 

      if (!token) {
        console.warn("⚠ No token found, but checking Redux state...");
        return;
      }

      try {
        const url = `${COMPANY_API_END_POINT}/get?keyword=${searchedQuery || ""}&_t=${new Date().getTime()}`;  
        console.log("Fetching companies from:", url);  

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:", res.data);
        if (res.data.success) {
          dispatch(companySlice.actions.setAllCompanies(res.data.companies));
        } else {
          console.warn("Response success flag is false:", res.data);
        }
      } catch (error) {
        console.error(
          "❌ Error fetching companies:",
          error?.response?.data?.message || error.message
        );
      }
    };

    if (token) {
      fetchAllCompanies(); 
    }
  }, [dispatch, searchedQuery, token]); 
};

export default useGetAllCompanies;

