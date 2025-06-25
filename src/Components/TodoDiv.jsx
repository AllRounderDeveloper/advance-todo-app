import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFirebase } from "../Context/Firebase";
import parse from "html-react-parser";

const TodosDiv = (props) => {
  // DEclaring the variables
  const firebase = useFirebase();
  const user = firebase.user;
  const location = useLocation().pathname;
  const [isDone, setIsDone] = useState(false);
  const { sno, title, desc, date, dueDate, dueTime, time } = props.todo;

  // The function to delete Todo
  const deleteTodo = async () => {
    try {
      const result = window.confirm("Do you want to delete todo?");
      if (!result) return;
      firebase.deleteData(`todo/${user.uid}_${sno}`);
      props.ReadingData();
      firebase.getHighSno("todo", user.uid);
    } catch (e) {
      console.log(e);
    }
  };

  // Getting the data of status
  useEffect(() => {
    const done = firebase.getDataByDoc(`todo/${user.uid}_${sno}`);
    if (done) {
      done.then((snap) => {
        if (snap) setIsDone(snap.data().done);
      });
    }
  }, [firebase, props, sno, user]);

  // Handling the checkbox
  const isDoneFunc = async () => {
    if (user) {
      setIsDone(!isDone);
      const newTodo = {
        sno: sno,
        title: title,
        desc: desc,
        date: date,
        time: time,
        done: !isDone,
        dueDate: dueDate,
        dueTime: dueTime,
        uid: user.uid,
      };
      await firebase.addData(`todo/${user.uid}_${sno}`, newTodo);
    }
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
                    checked={isDone || false}
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
                    onClick={deleteTodo}
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
