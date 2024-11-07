import { createAsyncThunk } from "@reduxjs/toolkit";

export const validateLogin = createAsyncThunk(
  "authAdmin/validateLogin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const url = `https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/admin?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzI5NjY2NDI3LCJleHAiOjE3MzE4MjY0Mjd9.d9_Q65-MRp4DvouWtDKfmmtoenz7fSnUOQfW3LpIU-I",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const user = data.data.find(
          (u) => u.user === username && u.pass === password
        );

        if (user) {
          return user;
        } else {
          return rejectWithValue("Invalid username or password");
        }
      } else {
        return rejectWithValue("Failed to fetch users.");
      }
    } catch (error) {
      return rejectWithValue("An error occurred during login.");
    }
  }
);
