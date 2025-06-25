import { useEffect, useState } from "react";
import TodosDiv from "../Components/TodoDiv";
import { useCallback } from "react";
import { SelectorFunc } from "../config/SelectorFunc";
import { useDispatch } from "react-redux";
import { getTodos } from "../Slices/Todo.slice";

const Main = () => {
  const { totalTodos, todos } = SelectorFunc("todos", false);
  const { user } = SelectorFunc("main", false);
  const [CurrentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const limit = 2;
  const [Loader, setLoader] = useState(true);
  let pages = [];

  //Reading the todos
  const ReadingData = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    dispatch(getTodos({ token, CurrentPage, limit })).then(() =>
      setLoader(false)
    );
  }, [limit, CurrentPage]);

  useEffect(() => {
    ReadingData();
  }, [ReadingData]);

  const userName = user?.userName?.split(" ")[0];

  for (let i = 1; i <= Math.ceil(totalTodos / limit); i++) {
    pages.push(i);
  }

  return (
    <main>
      {Loader ? (
        <div className="modern-center-container">
          <div className="loader-circle"></div>
          <span className="loader-text">Loading...</span>
        </div>
      ) : (
        <>
          <h2 className="text-center fw-bold">Welcome {userName}</h2>
          <hr />
          {!todos?.length <= 0 ? (
            <>
              <div className="todos">
                {todos.map((todo, index) => {
                  return (
                    <div key={index}>
                      <TodosDiv todo={todo} ReadingData={ReadingData} />
                    </div>
                  );
                })}
              </div>

              <div className="pagination">
                <button
                  className={`btn btn-success ${
                    CurrentPage === pages[0] ? "disabled" : ""
                  }`}
                  onClick={() => setCurrentPage(CurrentPage - 1)}
                  style={{ marginRight: "10px" }}
                >
                  Previous
                </button>

                {pages &&
                  pages.map((page, index) => {
                    return (
                      <div key={index}>
                        <button
                          className="btn btn-primary btn-large"
                          onClick={() => setCurrentPage(page)}
                          style={{ margin: "0" }}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}

                <button
                  className={`btn btn-success ${
                    CurrentPage === pages[pages.length - 1] ? "disabled" : ""
                  }`}
                  onClick={() => setCurrentPage(CurrentPage + 1)}
                  style={{ marginLeft: "10px" }}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="container text-white bg-danger text-center no-todos">
                <h3 className="fw-bold">No todos To display</h3>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default Main;
