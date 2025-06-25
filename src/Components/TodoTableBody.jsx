import React, { useState, useEffect } from "react";
import { useFirebase } from "../Context/Firebase";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

const TodoTableBody = (props) => {
  const firebase = useFirebase();
  const user = firebase.user;
  const [isDone, setIsDone] = useState(false);
  const { sno, title, desc, date, dueDate, dueTime, time } = props.todo;

  const deleteTodo = () => {
    const result = window.confirm("Do you want to delete todo?");
    if (!result) return;
    firebase.deleteData(`todo/${user}_${sno}`);
    props.ReadingData();
  };

  useEffect(() => {
    if (user.uid) {
      const done = firebase.getDataByDoc(`todo/${user.uid}_${sno}`);
      done.then((snap) => {
        if (snap) {
          setIsDone(snap.data().done);
        }
      });
    }
  }, [firebase, user, sno]);

  const isDoneFunc = () => {
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
    };
    firebase.addData(`todo/${user}${sno}`, newTodo);
  };
  const capitilizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  return (
    <>
      <tr>
        <td>
          <h5 className="todoItems_table ellipse-text">
            <input
              type="checkbox"
              name="done"
              id="done"
              checked={isDone}
              onChange={() => isDoneFunc()}
            />
            &ensp;
            {capitilizeFirstLetter(props.todo.title)}
          </h5>
        </td>
        <td>
          <p className="todoItems_table ellipse-text">
            {parse(capitilizeFirstLetter(props.todo.desc))}
          </p>
        </td>
        <td>
          <p className="todoItems_table">
            {props.todo.dueDate === "no" ? (
              "Not Set"
            ) : (
              <>
                {props.todo.dueDate} - {props.todo.dueTime}
              </>
            )}
          </p>
        </td>
        <td>
          <p className="todoItems_table">
            {props.todo.date} - {props.todo.time}
          </p>
        </td>
        <td>
          <p className="todoItems_table">
            <Link to={`/update/${props.todo.sno}`} className="todo_link">
              <button className="btn btn-warning text-white me-2">Edit</button>
            </Link>
            <Link to={"/"} className="todo_link">
              <button
                className="btn btn-danger text-white me-2"
                onClick={deleteTodo}
              >
                Delete
              </button>
            </Link>
          </p>
        </td>
      </tr>
    </>
  );
};

export default TodoTableBody;
