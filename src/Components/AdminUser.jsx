import { useEffect, useCallback, useState } from "react";
import TodosDiv from "./TodoDiv";
import {
  fetchTodos,
  fetchTotalTodos,
  fetchTodoByKey,
} from "../Slice/MainSlice";
import { useDispatch } from "react-redux";
import {
  blockAndUnblockUserByAdminFunc,
  DeleteUserByAdmin,
} from "../Slice/AdminSlice";

const AdminUser = (props) => {
  // Variable Declaration
  const [todos, setTodos] = useState([]);
  const dispatch = useDispatch();
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
        dispatch(fetchTotalTodos({ uid: userData.uid, key: "todos" })).then(
          (res) => {
            setTotalTodos(res.payload);
          }
        );
      }
    };
    func();
  }, [userData]);

  for (let i = 1; i <= Math.ceil(TotalTodos / postPerPage); i++) {
    Pages.push(i);
  }

  //Checking if the userData is blocked or not
  const CheckBlocked = useCallback(() => {
    if (userData) {
      dispatch(fetchTodoByKey({ key: `blocked/${userData.uid}` })).then(
        (res) => {
          setIsBlocked(res.payload.block);
        }
      );
    }
  }, [userData, fetchTodoByKey, dispatch]);

  useEffect(() => {
    CheckBlocked();
  }, [CheckBlocked]);

  //Getting Todos of each userData
  const ReadingTodos = useCallback(() => {
    if (userData) {
      dispatch(
        fetchTodos({
          userId: userData.uid,
          key: "todos",
          pageLimit: postPerPage,
          firstDoc: (currentPage - 1) * postPerPage,
        })
      ).then((res) => {
        setTodos(res.payload);
        setLoader(false);
      });
    }
  }, [userData, firstDocIndex, postPerPage, dispatch, fetchTodos]);

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
                dispatch(
                  blockAndUnblockUserByAdminFunc({
                    email: userData.email,
                    block: true,
                  })
                );
                CheckBlocked();
              }}
            >
              Block User <i className="fa-solid fa-eye-slash"></i>
            </button>
          ) : (
            <button
              className="btn btn-outline-success ms-2"
              onClick={() => {
                dispatch(
                  blockAndUnblockUserByAdminFunc({
                    email: userData.email,
                    block: false,
                  })
                );
                CheckBlocked();
              }}
            >
              Unblock User <i className="fa-solid fa-eye"></i>
            </button>
          )}
          <button
            className="btn btn-outline-danger ms-2"
            onClick={() => {
              dispatch(DeleteUserByAdmin({ user: userData }));
              props.ReadingData();
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
                  {userData?.email} (
                  {userData?.verify ? "Verified" : "Not Verified"})
                </h6>
              </td>
            </tr>
            <tr>
              <td>
                <h5>User Name</h5>
              </td>
              <td>
                <h6>{userData?.userName}</h6>
              </td>
            </tr>
            <tr>
              <td>
                <h5>UID</h5>
              </td>
              <td>
                <h6>{userData?.uid}</h6>
              </td>
            </tr>
            <tr>
              <td>
                <h5>Password</h5>
              </td>
              <td>
                <h6>{userData?.password}</h6>
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
              <h4>This Todos has no todos Yet</h4>
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
              onClick={() => {
                setCurrentPage(currentPage - 1);
                setLoader(true);
                setTodos([])
              }}
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
                  onClick={() => {
                    setCurrentPage(page);
                    setLoader(true);
                    setTodos([])
                  }}
                >
                  {page}
                </button>
              );
            })}
            <button
              className="btn btn-success"
              onClick={() => {
                setCurrentPage(currentPage + 1);
                setLoader(true);
                setTodos([])
              }}
              disabled={currentPage >= TotalTodos / postPerPage}
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
