// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import parse from "html-react-parser";
import { useFirebaseUser } from "../config/FirebaseFunc";
import { useDispatch } from "react-redux";
import { deleteTodo, addTodo } from "../Slice/MainSlice";
import { useState } from "react";

const TodosDiv = (props) => {
  // Declaring the variables
  const userData = useFirebaseUser();
  const Dispatch = useDispatch();
  const user = userData.user;
  const location = useLocation().pathname;
  const [isDone, setIsDone] = useState(false);

  // The function to delete Todo
  const deleteTodobyKey = () => {
    const permission = window.confirm("Are you sure you want to delete?");
    if (permission) {
      Dispatch(deleteTodo({ key: `todos/${user.uid}_${props.todo.sno}` }));

      if (props.Todos.length === 1) {
        const { currentPage, setCurrentPage } = props;
        setCurrentPage(currentPage - 1);
      }
    }
    props.ReadingData();
  };

  // Handling the checkbox
  const isDoneFunc = () => {
    const todo = { ...props.todo, done: !isDone };
    setIsDone(!isDone);
    Dispatch(
      addTodo({ key: `todos/${user.uid}_${props.todo.sno}`, data: todo })
    );
  };

  return (
    <>
      <div className="todos-div">
        <div className="left">
          <div className="left-top">
            <h4>
              {/* The done check box which is disable for admin */}
              {!(location === "/admin") && (
                <>
                  <input
                    type="checkbox"
                    name="done"
                    id="done"
                    onChange={isDoneFunc}
                    checked={isDone || props.todo.done || false}
                  />
                  &ensp;
                </>
              )}
              {props.todo.title}
            </h4>
          </div>
          <div className="display-Desc">{parse(props.todo.desc)}</div>
        </div>
        <div className="right">
          <h4>
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
                <Link to={`/update/${props.todo.sno}`} className="todo_link">
                  <button className="btn btn-warning text-white">Edit</button>
                </Link>
                <Link to={"/"} className="todo_link">
                  <button
                    className="btn btn-danger text-white"
                    onClick={deleteTodobyKey}
                  >
                    Delete
                  </button>
                </Link>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TodosDiv;
