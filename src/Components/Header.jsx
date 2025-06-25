//Importing modules
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../Context/Firebase";
import { FirebaseAuth } from "../config/Firebase";
import {
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const Header = (props) => {
  //Declaring variables
  const firebase = useFirebase();
  const user = firebase.user;
  const [Theme, setTheme] = useState("light");
  const [Email, setEmail] = useState("");
  const [Type, setType] = useState("");
  const [UserName, setUserName] = useState("");
  const [Verify, setVerify] = useState();
  const [deleted, setDeleted] = useState(false);

  //Logout function
  const handleLogout = async () => {
    const approve = window.confirm("Do you want to Logout from This account?");
    if (approve) {
      signOut(FirebaseAuth);
    }
  };

  //deleting account function
  const handelSignOut = async () => {
    const password = prompt(
      "Please re-enter your password to delete your account:"
    );

    const credential = EmailAuthProvider.credential(user.email, password);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        firebase.deleteUserByUid(user);
      })
      .catch((error) => {
        console.error("Error during re-auth or delete:", error);
        alert("Something went wrong. " + error.message);
      });
  };

  // Gettting the user's data from the database
  useEffect(() => {
    const func = async () => {
      if (user) {
        const snap = await firebase.getDataByDoc(`users/${user.uid}`);
        if (snap) {
          const data = snap.data();
          setTheme(data.theme);
          setEmail(data.email);
          setType(data.type);
          setUserName(data.userName);
          setVerify(data.verify);
          setDeleted(data.delete || false);
          props.handleTheme(data.theme);
        }
      }
    };
    func();
  }, [user, firebase, props]);

  const newTheme = Theme === "light" ? "dark" : "light";
  //Handling the theme changing
  const handleTheme = useCallback(() => {
    const func = async () => {
      if (user && UserName) {
        const data = {
          theme: newTheme,
          uid: user.uid,
          userName: UserName,
          email: Email,
          type: Type,
          verify: Verify,
          delete: deleted,
        };

        await firebase.addData(`users/${user.uid}`, data);
        setTheme(newTheme);
        props.handleTheme(newTheme);
      }
    };
    func();
  }, [firebase, user, newTheme, UserName, Email, Type, Verify, props, deleted]);

  return (
    // Main header section
    <header className={Theme === "dark" ? "dark-header" : ""}>
      <div>
        {/* Logo and heading */}
        <img src={props.logo} alt="this is the logo" />
        <a href="/" className="link">
          <h1>Todo List</h1>
        </a>
        {/* Navbar of the page */}
        {user ? (
          <>
            <ul className="navbar">
              <li>
                <Link to={"/"} className="link">
                  Home
                </Link>
              </li>
              <li>
                <Link to={"/create"} className="link">
                  Add
                </Link>
              </li>

              {user.uid === "vti9nMR6dmXZHoiIfAQiwurOdiJ3" ? (
                <li>
                  <Link to="/admin" className="link">
                    Admin
                  </Link>
                </li>
              ) : (
                ""
              )}
            </ul>
          </>
        ) : (
          ""
        )}
      </div>
      {/* The gear icon */}
      {user && (
        <>
          <div className="gear">
            <i className="fa-solid fa-gear icon"></i>
            <div className="dropdown">
              <Link className="text-info link" onClick={() => handleLogout()}>
                Logout&ensp;
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </Link>
              <Link
                className="text-danger link"
                onClick={() => handelSignOut()}
              >
                Delete Account&ensp;
                <i className="fa-solid fa-trash"></i>
              </Link>
              <Link
                className="text-secondary link"
                onClick={() => handleTheme()}
              >
                {Theme === "light" ? (
                  <>
                    Dark Mode &ensp;
                    <i className="fa fa-moon"></i>
                  </>
                ) : (
                  <>
                    Light Mode &ensp;
                    <i className="fa fa-sun"></i>
                  </>
                )}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
