import { configureStore } from "@reduxjs/toolkit";
import auth from "../Slices/Auth.slice";
import main from "../Slices/Main.slice";
import todos from "../Slices/Todo.slice";

export const store = configureStore({
  reducer: {
    auth,
    main,
    todos,
  },
});
