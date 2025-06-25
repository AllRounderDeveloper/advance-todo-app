//Importing components
import Header from "./Components/Header";
import FiltersPage from "./Components/Filters";

//Importing Pages
import Main from "./Pages/Main";
import LoginPage from "./Pages/Login";
import SignUpPage from "./Pages/SignUp";
import Create from "./Pages/Create";
import Update from "./Pages/Update";
import Admin from "./Pages/Admin";

//Importing Route Rstricts
import RouteRes from "./OtherFunc/RouteRes";
import SignUpRes from "./OtherFunc/SignUpRes";

//Importing Other Dependencies
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { FormatedDate, FormatedTime } from "./OtherFunc/LognFuncs";
import { useEffect, useState } from "react";
import { fetchTodoByKey } from "./Slice/MainSlice";
import { useFirebaseUser } from "./config/FirebaseFunc";
import { useDispatch } from "react-redux";
import { LogOut, SignOut } from "./Slice/LoginSignupSlice";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const App = () => {
  const [Theme, setTheme] = useState("light");
  const [Blocked, setBlocked] = useState();
  const [Delete, setDelete] = useState();
  const [Password, setPassword] = useState();
  const handleTheme = (theme) => setTheme(theme);
  const dispatch = useDispatch();
  const userData = useFirebaseUser()?.user;

  // check the user is blocked
  useEffect(() => {
    if (userData) {
      dispatch(fetchTodoByKey({ key: `blocked/${userData?.uid}` })).then(
        (res) => {
          setBlocked(res.payload?.block);
        }
      );
    }
  }, [dispatch, fetchTodoByKey, userData]);

  useEffect(() => {
    if (Blocked) {
      alert("Your Account is blocked by Admin due to certain reasons");
      dispatch(LogOut());
    }
  }, [Blocked, dispatch, LogOut]);

  //Check the user is deleted
  useEffect(() => {
    if (userData) {
      dispatch(fetchTodoByKey({ key: `users/${userData?.uid}` })).then(
        (res) => {
          setDelete(res.payload?.delete);
          setPassword(res.payload?.password);
        }
      );
    }
  }, [dispatch, fetchTodoByKey, userData]);

  useEffect(() => {
    const func = async () => {
      if (Delete) {
        alert("Your account has been deleted for more info contact admin.");
        if (userData?.email && Password) {
          try {
            const credential = EmailAuthProvider.credential(
              userData.email,
              Password
            );
            await reauthenticateWithCredential(userData, credential);
            await deleteUser(userData);
            dispatch(SignOut(userData.uid));
          } catch (error) {
            let errorMessage = error.message.replace(
              "Firebase: Error (auth/invalid-credential).",
              "Incorrect password."
            );
            alert("Re-authentication failed: " + errorMessage);
          }
        }
      }
    };
    func();
  }, [Delete, dispatch, LogOut]);

  return (
    <>
      <Header handleTheme={handleTheme} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <RouteRes
              element={
                <>
                  <FiltersPage Theme={Theme} />
                  <Main Theme={Theme} />
                </>
              }
            />
          }
        />
        <Route
          exact
          path="/create"
          element={
            <RouteRes
              element={
                <Create date={FormatedDate} time={FormatedTime} Theme={Theme} />
              }
            />
          }
        />
        <Route
          exact
          path="/update/:sno"
          element={
            <RouteRes
              element={
                <Update date={FormatedDate} time={FormatedTime} Theme={Theme} />
              }
            />
          }
        />
        <Route
          exact
          path="/admin"
          element={<RouteRes element={<Admin Theme={Theme} />} />}
        />
        <Route
          exact
          path="/login"
          element={<SignUpRes element={<LoginPage />} />}
        />
        <Route
          exact
          path="/signup"
          element={<SignUpRes element={<SignUpPage />} />}
        />
      </Routes>
    </>
  );
};

export default App;
