import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  SignUpUserWithEmailAndPassword,
  LogoutUser,
  LoginUser,
  DeleteAccountFunc,
} from "../config/FirebaseFunc";

export const Login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    try {
      const res = await LoginUser(email, password);
      return res;
    } catch (e) {
      console.log(e);
    }
  }
);

export const SignUp = createAsyncThunk(
  "Auth/SignUp",
  async ({ userName, email, password }) => {
    try {
      const res = SignUpUserWithEmailAndPassword(userName, email, password);
      return res;
    } catch (e) {
      console.log(e);
    }
  }
);

const initialState = {
  user: [],
};

export const LoginSignupSlice = createSlice({
  name: "LoginSignup",
  initialState,
  reducers: {
    LogOut: (state, action) => {
      LogoutUser();
    },
    SignOut: (state, action) => {
      DeleteAccountFunc(action.payload);
    },
  },
});

export const { LogOut, SignOut } = LoginSignupSlice.actions;

export default LoginSignupSlice.reducer;
