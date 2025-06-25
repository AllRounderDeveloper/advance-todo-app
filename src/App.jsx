//Importations of Pages
import "./App.css";
import Main from "./Pages/Main";
import Create from "./Pages/Create";
import SignUp from "./Pages/SignUp";
import Update from "./Pages/Update";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";

//Importations of Components
import Logo from "./logo.png";
import Header from "./Components/Header";
import RouteRestrict from "./Context/PrivateRouteOther";
import RouteRestrictSign from "./Context/PrivateRouteSign";
import AdminRoute from "./Context/AdminRoute";
import FiltersPage from "./Components/Filters";

//Other Importations
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { FormatedDate, FormatedTime } from "./Context/LognFuncs";
import { useFirebase } from "./Context/Firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { FirebaseAuth } from "./config/Firebase";

const App = () => {
  //Decelaration of variables
  const firebase = useFirebase();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const user = firebase.user;
  const [Sno, setSno] = useState(0);
  const [type, setType] = useState("section");
  const [typeTodo, setTypeTodo] = useState("section");
  const [doneNot, setDoneNot] = useState("all");
  const [Theme, setTheme] = useState();
  const [IsDelete, setIsDelete] = useState(false);
  const [Blocked, setBlocked] = useState(false);
  const [Password, setPassword] = useState();

  // Some Query / Filter functions
  const handleType = (type) => setTypeTodo(type);
  const HandleDateType = (datefrom, dateTo) => {
    setFrom(datefrom);
    setTo(dateTo);
  };
  const HandleDone_Not = (type) => setDoneNot(type);
  const handleTheme = (theme) => setTheme(theme);

  //Taking display type from firebase
  useEffect(() => {
    if (user) {
      firebase
        .getDataByDoc(`users/${user.uid}`)
        .then((snap) => {
          if (snap) {
            const data = snap.data();
            setType(data.type);
            setTypeTodo(data.type);
            setIsDelete(data.delete);
            setPassword(data.password);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [firebase, user]);

  //Taking Sno from firebase
  useEffect(() => {
    const func = async () => {
      if (user) {
        const newSno = await firebase.Sno;
        setSno(newSno);
      }
    };
    func();
  }, [firebase, user]);

  //Checking that the user is blocked or not
  useEffect(() => {
    if (user) {
      const func = async () => {
        const snap = await firebase.CheckBlocked(user.email);
        snap.forEach((doc) => {
          setBlocked(doc.data().block);
        });
      };
      func();
    }
  }, [user, firebase]);

  useEffect(() => {
    if (Blocked) {
      signOut(FirebaseAuth);
      alert(
        "You are blocked by the admin due to certain reasons. Please contact the admin for more information."
      );
    }
  }, [Blocked]);

  //Deleting the user if user is deleted by admin
  useEffect(() => {
    setTimeout(() => {
      if (IsDelete) {
        if (user) {
          const func = async () => {
            const credential = EmailAuthProvider.credential(
              user.email,
              Password
            );

            reauthenticateWithCredential(user, credential)
              .then(() => {
                alert("Your account has been deleted by the admin.");
                firebase.deleteUserByUid(user);
              })
              .catch((error) => {
                console.error("Error during re-auth or delete:", error);
                alert("Something went wrong. " + error.message);
              });
          };
          func();
        }
      }
    }, 2000);
  }, [IsDelete, Password, firebase, user]);

  //Returning the JSX
  return (
    <Router>
      <Header logo={Logo} handleTheme={handleTheme} />
      <Routes>
        <Route
          path="/"
          element={
            <RouteRestrict
              element={
                <>
                  <FiltersPage
                    handleType={handleType}
                    HandleDateType={HandleDateType}
                    HandleDone_Not={HandleDone_Not}
                    Theme={Theme}
                  />
                  <Main
                    typeTodo={typeTodo}
                    from={from}
                    to={to}
                    doneNot={doneNot}
                    Theme={Theme}
                  />
                </>
              }
            />
          }
        />
        <Route
          path="/admin"
          element={
            <RouteRestrict
              element={<AdminRoute element={<Admin Theme={Theme} />} />}
            />
          }
        />
        <Route
          path="/create"
          element={
            <RouteRestrict
              element={
                <Create
                  date={FormatedDate}
                  sno={Sno}
                  lastType={type}
                  time={FormatedTime}
                  Theme={Theme}
                />
              }
            />
          }
        />
        <Route
          path="/update/:sno"
          element={
            <RouteRestrict
              element={
                <Update date={FormatedDate} time={FormatedTime} Theme={Theme} />
              }
            />
          }
        />
        <Route
          path="/signup"
          element={<RouteRestrictSign element={<SignUp />} />}
        />
        <Route
          path="/login"
          element={<RouteRestrictSign element={<Login />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
