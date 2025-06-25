import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPagination,
  HighSno,
  AddDataToFireStore,
  TotalTodosFun,
  DeleteTodoFunc,
  getTodoBySno,
} from "../config/FirebaseFunc";

// MAKIN THE THUNKS FOR ASYNC FUNCS
// Getting the todos
export const fetchTodos = createAsyncThunk(
  "Main/fetchTodos",
  async ({ userId, key, pageLimit, firstDoc, search, status, from, to }) => {
    const data = await getPagination(
      userId,
      key,
      pageLimit,
      firstDoc,
      search,
      status,
      from,
      to
    );
    return data;
  }
);

// Getting the highSno
export const fetchHighSno = createAsyncThunk(
  "Main/fetchHighSno",
  async ({ userId }) => {
    const highSno = await HighSno(userId);
    return highSno;
  }
);

// Getting the total todos
export const fetchTotalTodos = createAsyncThunk(
  "Main/TotalTodos",
  async ({ uid, key }) => {
    if (key) {
      const count = await TotalTodosFun(uid, key);
      return count;
    }
  }
);

//Getting Todos by key
export const fetchTodoByKey = createAsyncThunk(
  "Main/GetTodo",
  async ({ key }) => {
    const data = await getTodoBySno(key);
    return data;
  }
);

//Setting the initial state
const initialState = {
  highSno: 1,
  totalTodos: 1,
};

export const MainSlice = createSlice({
  name: "Main",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const { key, data } = action.payload;
      AddDataToFireStore(key, data);
    },
    deleteTodo: (state, action) => {
      const { key } = action.payload;
      DeleteTodoFunc(key);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHighSno.fulfilled, (state, action) => {
        state.highSno = action.payload;
      })

      .addCase(fetchTotalTodos.fulfilled, (state, action) => {
        state.totalTodos = action.payload;
      });
  },
});

export const { addTodo, deleteTodo } = MainSlice.actions;
export default MainSlice.reducer;
