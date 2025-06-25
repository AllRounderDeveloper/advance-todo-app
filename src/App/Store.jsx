import { configureStore } from "@reduxjs/toolkit";
import MainSlice from "../Slice/MainSlice";
import LoginSignupSlice from "../Slice/LoginSignupSlice";
import AdminSlices from "../Slice/AdminSlice";

export const Store = configureStore({
  reducer: {
    Main: MainSlice,
    LoginSignup: LoginSignupSlice,
    Admin: AdminSlices,
  },
});
