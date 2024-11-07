import { createSlice } from "@reduxjs/toolkit";
import { validateLogin } from "./authSliceThunk";

const initialState = {
  isAuthenticated:
    localStorage.getItem("isAuthenticated") === "true" ? true : false,
  username: localStorage.getItem("username") || "-",
  email: localStorage.getItem("email") || "-",
  userid: localStorage.getItem("userid") || 0,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "-";
      state.userid = 0;
      state.token = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("userid");
      localStorage.removeItem("token");
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
        state.token = action.payload.token;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", action.payload.user);
        localStorage.setItem("userid", action.payload._id);
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(validateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
