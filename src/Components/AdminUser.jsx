import React, { useEffect, useCallback, useState } from "react";
import TodosDiv from "./TodoDiv";
import { useFirebase } from "../Context/Firebase";

const AdminUser = (props) => {
  // Variable Declaration
  const [todos, setTodos] = useState([]);
  const firebase = useFirebase();
  const userData = props.user;
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 2;
  const lastDocIndex = currentPage * postPerPage;
  const firstDocIndex = lastDocIndex - postPerPage;
  const [TotalTodos, setTotalTodos] = useState(0);
  const [IsBlocked, setIsBlocked] = useState();
  let Pages = [];

  //Taking Total Todos for pagination
  useEffect(() => {
    const func = async () => {
      if (userData) {
        await firebase.TotalTodosFun(userData.uid, "todo");
        const snap = await firebase.TotalTodos;
        const count = Math.ceil(snap / postPerPage);
        setTotalTodos(count);
      }
    };
    func();
  }, [firebase, userData]);

  for (let i = 1; i <= TotalTodos; i++) {
    Pages.push(i);
  }

  //Checking if the userData is blocked or not
  const CheckBlocked = useCallback(() => {
    if (userData) {
      const func = async () => {
        const snap = await firebase.CheckBlocked(userData.email);
        if (snap) {
          snap.forEach((doc) => {
            const data = doc.data();
            setIsBlocked(data.block);
          });
        }
      };
      func();
    }
  }, [userData, firebase]);

  useEffect(() => {
    CheckBlocked();
  }, [CheckBlocked]);

  //Getting Todos of each userData
  const ReadingTodos = useCallback(() => {
    if (userData) {
      const func = async () => {
        setTodos([]);
        setLoader(true);
        const snap = await firebase.getPagination(
          userData.uid,
          "todo",
          postPerPage,
          firstDocIndex
        );
        setTodos(snap);
        setLoader(false);
      };
      func();
    }
  }, [userData, firebase, firstDocIndex, postPerPage]);

  useEffect(() => {
    ReadingTodos();
  }, [ReadingTodos]);

  return (
    <>
      <div className="todos">
        <h2 className="text-center">Admin Actions</h2>
        <div className="admin-actions">
          {!IsBlocked ? (
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => {
                firebase.BlockUser(userData.email, userData.uid);
                CheckBlocked();
              }}
            >
              Block User <i className="fa-solid fa-eye-slash"></i>
            </button>
          ) : (
            <button
              className="btn btn-outline-success ms-2"
              onClick={() => {
                firebase.UnBlockUser(userData.email, userData.uid);
                CheckBlocked();
              }}
            >
              Unblock User <i className="fa-solid fa-eye"></i>
            </button>
          )}
          <button
            className="btn btn-outline-danger ms-2"
            onClick={() => {
              firebase.DeleteUserByAdmin(userData.uid);
              props.ReadingData();
              props.returningUsers();
            }}
          >
            Delete User <i className="fa-solid fa-trash"></i>
          </button>
        </div>
        <h2 className="text-center">User's Data</h2>
        <table
          className={`table ${props.Theme === "dark" ? "table-dark" : ""}`}
        >
          <tbody>
            <tr>
              <td>
                <h5>Email</h5>
              </td>
              <td>
                <h6>
                  {userData.email} (
                  {userData.verify ? "Verified" : "Not Verified"})
                </h6>
              </td>
            </tr>
            <tr>
              <td>
                <h5>User Name</h5>
              </td>
              <td>
                <h6>{userData.userName}</h6>
              </td>
            </tr>
            <tr>
              <td>
                <h5>UID</h5>
              </td>
              <td>
                <h6>{userData.uid}</h6>
              </td>
            </tr>
            <tr>
              <td>
                <h5>Current Display Type</h5>
              </td>
              <td>
                <h6>{userData.type}</h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="text-center">User's Todos</h2>
      {todos.length === 0 ? (
        <>
          {!loader ? (
            <div className="container text-white bg-danger noTodos text-center">
              <h4>This userData has no todos Yet</h4>
            </div>
          ) : (
            <div className="loader"></div>
          )}
        </>
      ) : (
        <div className="todos">
          {todos.map((todo, index) => {
            return (
              <TodosDiv
                key={index}
                todo={todo}
                ReadingData={props.ReadingData}
                uid={userData.uid}
              />
            );
          })}

          {/* Pagination */}
          <div className="pagination">
            <button
              className="btn btn-success"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            {Pages.map((page, index) => {
              return (
                <button
                  className={`btn btn-primary ${
                    page === currentPage ? "active" : ""
                  }`}
                  key={index}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="btn btn-success"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= TotalTodos}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUser;
