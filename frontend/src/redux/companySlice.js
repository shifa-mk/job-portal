import { createSlice } from "@reduxjs/toolkit";

// Modify the reducer action to align with the dispatch call
const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [],
        searchCompanyByText: "",
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setAllCompanies: (state, action) => {  // ✅ Match the action with the dispatch
            state.companies = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        }
    }
});

export const {setSingleCompany, setCompanies,setSearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;