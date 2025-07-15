import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { fetchTodos, fetchTotalTodos } from "../Slice/MainSlice";
import { useFirebaseUser } from "../config/FirebaseFunc";
import TodosDiv from "../Components/TodoDiv";
import { useSearchParams } from "react-router-dom";

const Main = (props) => {
  const [TodosState, setTodosState] = useState();
  const dispatch = useDispatch();
  const userData = useFirebaseUser();
  const [Loading, setLoading] = useState(true);
  const user = userData.user;
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 2;
  let Pages = [];
  const firstDocIndex = (currentPage - 1) * postPerPage;
  let TotalTodos = useSelector((state) => state.Main.totalTodos);
  const totalPages = Math.ceil((TotalTodos || 0) / postPerPage);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  //Redaing the Total Number of Todos and Todos
  const ReadingData = useCallback(() => {
    if (user) {
      setLoading(true);
      setTodosState();
      dispatch(fetchTotalTodos({uid: user.uid, key: "todos"}))
      dispatch(
        fetchTodos({
          userId: user?.uid,
          key: "todos",
          pageLimit: postPerPage,
          firstDoc: firstDocIndex,
          search: searchQuery,
          status,
          from,
          to,
        })
      )
        .then((res) => {
          console.log(res);
          setTodosState(res.payload || []);
        })
        .finally(() => setLoading(false));
    }
  }, [
    dispatch,
    user,
    searchQuery,
    status,
    from,
    to,
    firstDocIndex,
    user?.uid,
    postPerPage,
  ]);

  useEffect(() => {
    ReadingData();
  }, [ReadingData]);

  console.log(TotalTodos);
  for (let i = 1; i <= Math.ceil((TotalTodos || 0) / postPerPage); i++) {
    Pages.push(i);
  }
  const usersName = user?.displayName?.split(" ")[0];

  return (
    <main className={`main-main ${props.Theme === "dark" ? " dark" : ""}`}>
      <h2 className="text-center">Welcome {usersName ?? "User"}</h2>
      {Loading || !user ? (
        <div className="loader"></div>
      ) : (
        TodosState && (
          <>
            {TodosState.length !== 0 ? (
              <div className="main">
                {/* Displaying all the todos */}
                {TodosState.map((todo, index) => (
                  <TodosDiv
                    todo={todo}
                    key={index}
                    ReadingData={ReadingData}
                    Todos={TodosState}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                ))}

                {/* Pagination */}
                <div className="pagination">
                  <button
                    className="btn btn-success"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>

                  {Pages.map((page, index) => (
                    <button
                      key={index}
                      className={`btn btn-primary${
                        page === currentPage ? " active" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(page);
                        setTodosState();
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      setTodosState();
                    }}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="container text-white bg-danger noTodos text-center mt-5">
                <h2>No Todos To Display</h2>
              </div>
            )}
          </>
        )
      )}
    </main>
  );
};

export default Main;
