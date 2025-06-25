//Importing Modules
import { useEffect, useState, useCallback } from "react";
import TodosDiv from "../Components/TodoDiv";
import TodosTable from "../Components/TodoTable";
import { useFirebase } from "../Context/Firebase";
import { useSearchParams } from "react-router-dom";

const Main = (props) => {
  // Hooks and variables
  const firebase = useFirebase();
  const [params] = useSearchParams();
  const user = firebase.user;
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [userName, setUserName] = useState("");
  const [todoGet, setTodoGet] = useState([]);
  const [todoDate, setTodoDate] = useState([]);
  const [todoDone, setTodoDone] = useState([]);
  const [showLoader, setshowLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 2;
  const lastDocIndex = currentPage * postPerPage;
  const firstDocIndex = lastDocIndex - postPerPage;
  const [TotalTodos, setTotalTodos] = useState(0);
  let Pages = [];
  const searchParam = params.get("search") || "nosearch";

  // Getting the total todos
  useEffect(() => {
    const func = async () => {
      await firebase.TotalTodosFun(user.uid, "todo");
      const snap = await firebase.TotalTodos;
      const count = Math.ceil(snap / postPerPage);
      setTotalTodos(count);
    };
    func();
  }, [firebase, user]);

  // Getting all the todos by pagination
  const ReadingData = useCallback(async () => {
    setTodoGet([]);
    setshowLoader(true);
    if (user) {
      const snap = await firebase.getPagination(
        user.uid,
        `todo`,
        postPerPage,
        firstDocIndex
      );
      if (snap) {
        setshowLoader(false);
      }
      setTodoGet(snap);
    }
  }, [user, firebase, firstDocIndex, postPerPage]);

  //Handleing to change the curret page
  const changeCurrentPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  useEffect(() => {
    ReadingData();
  }, [ReadingData]);

  // Getting the todos by date
  useEffect(() => {
    const func = async () => {
      const snap = await firebase.handleDate(
        user.uid,
        "todo",
        props.to,
        props.from,
        todoGet
      );

      if (snap !== todoGet) {
        setTotalTodos(snap.length);
      }
      setTodoDate(snap);
    };
    func();
  }, [props, todoGet, firebase, user.uid]);

  // Getting the todos by Search bar
  useEffect(() => {
    const func = async () => {
      const snap = await firebase.handleSearch(
        searchParam,
        user.uid,
        `todo`,
        todoDate
      );

      if (snap !== todoDate) {
        setTotalTodos(snap.length);
      }

      setTodoDone(snap);
    };
    func();
  }, [searchParam, todoDate, firebase, user.uid]);

  // Getting the todos by done
  useEffect(() => {
    const func = async () => {
      const snap = await firebase.handleDone(
        user.uid,
        "todo",
        props.doneNot,
        todoDone
      );

      if (snap !== todoDone) {
        setTotalTodos(Math.ceil(snap.length / postPerPage));
      }

      setTodos(snap);
    };

    func();
  }, [props, todoDone, user.uid, firebase]);

  // Filtering the todos
  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  // Displaying the user names
  useEffect(() => {
    const userNamefromUser = user?.displayName;
    const firstnameAndLastName = userNamefromUser?.split(" ");
    if (firstnameAndLastName) {
      setUserName(firstnameAndLastName[0]);
    }
  }, [user, firebase]);

  for (let i = 1; i <= TotalTodos; i++) {
    Pages.push(i);
  }

  return (
    <>
      <main className={`${props.Theme} main-main`}>
        <div className="main">
          <h2>Welcome {userName || "User"}</h2>

          {
            // Displaying the todos in form of section
            props.typeTodo === "section" ? (
              filteredTodos.length === 0 ? (
                <>
                  {!showLoader ? (
                    <div className="container text-white bg-danger noTodos text-center mt-5">
                      <h2>No todos to display</h2>
                    </div>
                  ) : (
                    <>{showLoader && <div className="loader"></div>}</>
                  )}
                </>
              ) : (
                <>
                  {filteredTodos.map((todo, index) => {
                    return (
                      <div key={index}>
                        <TodosDiv
                          todo={todo}
                          ReadingData={ReadingData}
                          uid={user.uid}
                        />
                      </div>
                    );
                  })}

                  {/* Displaying the pagination */}
                  <div className="pagination">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        changeCurrentPage(currentPage - 1);
                      }}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </button>

                    {Pages.map((page, index) => {
                      return (
                        <button
                          key={index}
                          className={`btn btn-primary ${
                            page === currentPage ? "active" : ""
                          }`}
                          onClick={() => {
                            changeCurrentPage(page);
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      className="btn btn-success"
                      onClick={() => {
                        changeCurrentPage(currentPage + 1);
                      }}
                      disabled={currentPage === TotalTodos}
                    >
                      Next
                    </button>
                  </div>
                </>
              )
            ) : (
              //Displaying Todos in form of Tables
              <>
                {
                  <TodosTable
                    todos={filteredTodos}
                    ReadingData={ReadingData}
                    currentPage={currentPage}
                    changeCurrentPage={changeCurrentPage}
                    postPerPage={postPerPage}
                    showLoader={showLoader}
                    Pages={Pages}
                  />
                }
              </>
            )
          }
        </div>
      </main>
    </>
  );
};
export default Main;