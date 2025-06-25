import { Link, useLocation } from "react-router-dom";
import parse from "html-react-parser";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteTodobyId, updateTodo } from "../Slices/Todo.slice";

const TodosDiv = (props) => {
  // Declaring the variables
  const dispatch = useDispatch();
  const location = useLocation().pathname;
  const [isDone, setIsDone] = useState(props.todo.done || false);

  // The function to delete Todo
  const deleteTodo = async (DeleteRes) => {
    if (DeleteRes) {
      const token = localStorage.getItem("token");

      dispatch(deleteTodobyId({ token, id: props.todo._id }))
        .then(() => toast.success("Todo Deleted", { position: "bottom-right" }))
        .catch(() =>
          toast.error("Error Deleting Todo", { position: "bottom-right" })
        );

      if (props.todo.length === 1) {
        const { currentPage, setCurrentPage } = props;
        setCurrentPage(currentPage - 1);
      }
    }
    props.ReadingData();
  };

  // Show delete confirmation using react-hot-toast
  const showDeleteConfirmation = () => {
    toast(
      (t) => (
        <div>
          <p>Do you want to delete this Todo?</p>

          <div className="mt-2">
            <button
              className="btn btn-sm btn-outline-danger m-1"
              onClick={() => {
                deleteTodo(true);
                toast.dismiss(t.id);
              }}
            >
              Delete Todo
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, position: "bottom-right" }
    );
  };

  // Handling the checkbox
  const isDoneFunc = async () => {
    const proptodo = props?.todo;
    const todo = { ...proptodo, done: !isDone };
    try {
      dispatch(updateTodo({ todo, id: todo._id }));
      props.ReadingData();
      setIsDone(!isDone);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="todos-div">
      <div className="left">
        <div className="left-top">
          <h4>
            {/* The done checkbox which is disabled for admin */}
            {!(location === "/admin") && (
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  name="done"
                  id="done"
                  onChange={isDoneFunc}
                  checked={isDone}
                />
                <span className="checkmark"></span>
              </label>
            )}
            <span className="h3">{props.todo.title}</span>
          </h4>
        </div>
        <div className="display-Desc">{parse(props.todo.desc)}</div>
      </div>
      <div className="right">
        <h4 className="fw-500">
          Last Update:{" "}
          <span>
            {props.todo.date} - {props.todo.time}
          </span>
        </h4>
        <h4>
          Due Date:{" "}
          <span>
            {props.todo.dueDate === "no" ? (
              "Not Set"
            ) : (
              <>
                {props.todo.dueDate} - {props.todo.dueTime}
              </>
            )}
          </span>
        </h4>

        {/* Adding the edit and delete button */}
        <div className="todo-actions">
          {location !== "/admin" ? (
            <>
              <Link to={`/update/${props.todo._id}`} className="todo_link">
                <button className="btn btn-warning text-white">Edit</button>
              </Link>
              <button
                className="btn btn-danger text-white"
                onClick={() => {
                  showDeleteConfirmation();
                }}
              >
                Delete
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default TodosDiv;
