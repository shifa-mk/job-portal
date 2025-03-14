import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        sessionStorage.removeItem("user");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
export { instance };
