import { createSlice } from "@reduxjs/toolkit";
import { validateLogin } from "./authSliceAdminThunk";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticatedAdmin") === "true",
  username: "-",
  userid: 0,
  loading: false,
  error: null,
};

const authAdminSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "";
      state.userid = 0;
      localStorage.setItem("isAuthenticatedAdmin", "false"); // Update logout status
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

        // Ensure these properties match your API response structure
        state.username = action.payload.username || "-";
        state.userid = action.payload._id || 0;

        localStorage.setItem("isAuthenticatedAdmin", "true");
      })
      .addCase(validateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred.";
      });
  },
});

export const { logout } = authAdminSlice.actions;
export default authAdminSlice.reducer;
