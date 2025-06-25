import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const getTheme = createAsyncThunk("Main/getTheme", async ({ token }) => {
  const res = await axios.get(`/theme/themeswork`, { headers: { token } });
  return res.data;
});

export const setTheme = createAsyncThunk("Main/setTheme", async () => {
  const token = localStorage.getItem("token");
  await axios.patch("/theme/themeswork", {}, { headers: { token } });
});

export const getUser = createAsyncThunk("Main/user", async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const res = await axios.get(`/api/user`, {
      withCredentials: true,
      headers: { token },
    });

    return res.data;
  } else {
    return null;
  }
});

const initialState = {
  theme: null,
  user: null,
};

const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTheme.fulfilled, (state, action) => {
        state.theme = action.payload.theme;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload?.user;
      });
  },
});

export const {} = MainSlice.actions;
export default MainSlice.reducer;
