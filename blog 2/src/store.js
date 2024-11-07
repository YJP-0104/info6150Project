import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";
import authAdminReducer from "./store/authSliceAdmin";
const store = configureStore({
  reducer: {
    auth: authReducer,
    authadmin: authAdminReducer,
  },
});

export default store;
