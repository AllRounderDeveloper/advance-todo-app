//Pages
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Create from "./Pages/Create";
import Main from "./Pages/Main";
import Update from "./Pages/Update";

//Components
import Header from "./Components/Header";
import { Toaster } from "react-hot-toast";

// Route Restricts
import RouteRes from "./config/RouteRes";
import SignupRes from "./config/SignupRes";

//Other Imports
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { FormatedDate as Date, FormatedTime as Time } from "./config/DateTime";
import { SelectorFunc } from "./config/SelectorFunc";
import { getTheme, getUser } from "./Slices/Main.slice";

const App = () => {
  const { theme, user } = SelectorFunc("main", false);
  const [Loader, setLoader] = useState(true);
  const [RouteLoader, setRouteLoader] = useState(true);
  const dispatch = useDispatch();

  //Fetching th user
  const refreshUser = useCallback(() => {
    dispatch(getUser()).then(() => setRouteLoader(false));
  }, []);

  //Checking the theme
  const checkTheme = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getTheme({ token })).unwrap();
    }
    setLoader(false);
  }, [dispatch, getTheme]);

  useEffect(() => {
    checkTheme();
    refreshUser();
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme, checkTheme, refreshUser]);

  return (
    <>
      {Loader ? (
        <div className="modern-center-container">
          <div className="loader-circle"></div>
          <span className="loader-text">Loading...</span>
        </div>
      ) : (
        <>
          <Toaster />
          <Header checkTheme={checkTheme} />
          <Routes>
            <Route
              exact
              path="/"
              element={<RouteRes element={<Main />} loader={RouteLoader} />}
            />
            <Route
              exact
              path="/create"
              element={
                <RouteRes
                  element={<Create date={Date} time={Time} user={user} />}
                  loader={RouteLoader}
                />
              }
            />

            <Route
              exact
              path="/update/:id"
              element={<RouteRes element={<Update />} loader={RouteLoader} />}
            />

            <Route
              exact
              path="/signup"
              element={
                <SignupRes
                  element={<Signup checkTheme={checkTheme} />}
                  loader={RouteLoader}
                />
              }
            />
            <Route
              exact
              path="/login"
              element={
                <SignupRes
                  element={<Login checkTheme={checkTheme} />}
                  loader={RouteLoader}
                />
              }
            />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
