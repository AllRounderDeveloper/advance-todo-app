import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const getTodos = createAsyncThunk(
  "Todos/getTodos",
  async ({ limit, token, CurrentPage }) => {
    const res = await axios.get(`/todo/`, {
      headers: { token, limit, currentpage: CurrentPage },
    });

    return res.data;
  }
);

export const createTodo = createAsyncThunk(
  "Todos/createTodo",
  async ({ todo }) => {
    axios.post("/todo/", { ...todo });
  }
);

export const updateTodo = createAsyncThunk(
  "Todos/update",
  async ({ todo, id }) => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `/todo/${id}`,
      {
        todo: { ...todo },
      },
      { headers: { token } }
    );
  }
);

export const deleteTodobyId = createAsyncThunk(
  "Todos/delete",
  async ({ id, token }) => {
    const res = await axios.delete(`/todo/${id}`, {
      headers: { token },
    });

    return res.data;
  }
);

export const getTodo = createAsyncThunk("Todos/getTodo", async ({ id }) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`/todo/${id}`, { headers: { token } });

  return res.data;
});

const initialState = {
  highSno: null,
  totalTodos: null,
  todos: null,
  todo: null,
  todoBool: null,
};

const TodoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.fulfilled, (state, action) => {
        state.todos = action.payload.todos;
        state.totalTodos = action.payload.totalTodos;
        state.highSno = action.payload.sno;
      })
      .addCase(getTodo.fulfilled, (state, action) => {
        state.todo = action.payload.todo;
        state.todoBool = action.payload.bool;
      });
  },
});

export default TodoSlice.reducer;
