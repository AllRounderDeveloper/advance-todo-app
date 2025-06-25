import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GetUsersByColl,
  blockAndUnBlockUserByAdmin,
  checkBlockedUser,
  DeleteUserByAdminFunc,
} from "../config/FirebaseFunc";

export const getUsersForAdmin = createAsyncThunk(
  "Admin/getUsersForAdmin",
  async ({ key }) => {
    const response = await GetUsersByColl(key);
    return response;
  }
);

export const checkBlockOrNot = createAsyncThunk(
  "Admin/checkBlockOrNot",
  async ({ email }) => {
    const res = await checkBlockedUser(email);
    return res;
  }
);

const initialState = {
  users: null,
  block: null,
};

export const AdminSlices = createSlice({
  name: "Admin",
  initialState,
  reducers: {
    blockAndUnblockUserByAdminFunc: (state, action) => {
      const func = async () => {
        return await blockAndUnBlockUserByAdmin(
          action.payload.email,
          action.payload.block
        );
      };
      func();
    },
    DeleteUserByAdmin: (state, action) => {
      const { user } = action.payload;
      DeleteUserByAdminFunc(user.uid);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsersForAdmin.fulfilled, (state, action) => {
      state.users = action.payload;
    });

    builder.addCase(checkBlockOrNot.fulfilled, (state, action) => {
      state.block = action.payload;
    });
  },
});

export const { blockAndUnblockUserByAdminFunc, DeleteUserByAdmin } =
  AdminSlices.actions;
export default AdminSlices.reducer;
