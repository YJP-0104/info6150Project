import { createSlice } from "@reduxjs/toolkit";

import { validateLogin } from "./authSliceThunk";

const initialState = {
  isAuthenticated:
    localStorage.getItem("isAuthenticated") === "true" ? true : false, // Load from localStorage
  username: "-",
  userid: 0,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "";
      state.userid = 0;
      localStorage.removeItem("isAuthenticated");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.user;
        state.userid = action.payload._id;
        localStorage.setItem("isAuthenticated", "true");
      })
      .addCase(validateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
