import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Store/authSlice";
import authAdminReducer from "./Store/authSliceAdmin";

const store = configureStore({
  reducer: {
    auth: authReducer,
    authadmin: authAdminReducer,

  },
});

export default store;
