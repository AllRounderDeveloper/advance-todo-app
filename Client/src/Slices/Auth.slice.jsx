import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const Signup = createAsyncThunk("Auth/Signup", async (formData) => {
  try {
    const userData = { ...formData, theme: "light", blocked: false };

    const res = await axios.post("/api/user", { ...userData });
    return res.data;
  } catch (e) {
    throw new Error(e);
  }
});

export const LoginFunc = createAsyncThunk("Auth/LoginFunc", async (data) => {
  try {
    const response = await axios.post("/api/login", { ...data });
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
});

export const SignOut = createAsyncThunk(
  "Auth/Logout",
  async ({ deletePass, token }) => {
    const res = await axios.post(
      "/api/signout",
      { password: deletePass },
      { headers: { token } }
    );
    return res.data;
  }
);

export const ChangePass = createAsyncThunk(
  "Auth/ChangePass",
  async ({ currentPassword, newPassword, token }) => {
    const res = await axios.post(
      "/api/changePass",
      { currentPassword: currentPassword, newPassword: newPassword },
      {
        headers: {
          token,
        },
      }
    );

    return res.data;
  }
);

const initialState = {
  signup: {
    AT: null,
    message: null,
    bool: null,
  },
  login: {
    message: null,
    bool: null,
    AT: null,
  },
  signout: {
    message: "",
    bool: null,
  },
  changePass: {
    ChangePass_message: null,
    ChangePass_bool: null,
  },
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state, action) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginFunc.fulfilled, (state, action) => {
        state.login.message = action.payload.message;
        state.login.bool = action.payload.bool;
        state.login.AT = action.payload.token;
      })
      .addCase(Signup.fulfilled, (state, action) => {
        state.signup.AT = action.payload.AT;
        state.signup.message = action.payload.message;
        state.signup.bool = action.payload.bool;
      })
      .addCase(SignOut.fulfilled, (state, action) => {
        state.signout.bool = action.payload.bool;
        state.signout.message = action.payload.message;
      })
      .addCase(ChangePass.fulfilled, (state, action) => {
        state.changePass.ChangePass_bool = action.payload.bool;
        state.changePass.ChangePass_message = action.payload.message;
      });
  },
});

export const { resetState } = AuthSlice.actions;
export default AuthSlice.reducer;
