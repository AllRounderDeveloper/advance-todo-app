//Importing modules
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useFirebaseUser } from "../config/FirebaseFunc";
import { useDispatch } from "react-redux";
import { LogOut, SignOut } from "../Slice/LoginSignupSlice";
import { fetchTodoByKey, addTodo } from "../Slice/MainSlice";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { useEffect, useState } from "react";

const Header = (props) => {
  //Declaring variables
  const { user } = useFirebaseUser();
  const dispatch = useDispatch();
  const [Theme, setTheme] = useState("light");

  //Logout function
  const handleLogout = () => {
    dispatch(LogOut());
  };

  //SignoutFunc
  const handelSignOut = async () => {
    const pass = prompt("Enter your password to delete your account: ");
    if (pass && user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, pass);

        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        dispatch(SignOut(user.uid));
      } catch (error) {
        let errorMessage = error.message.replace(
          "Firebase: Error (auth/invalid-credential).",
          "Incorrect password."
        );
        alert("Re-authentication failed: " + errorMessage);
      }
    }
  };

  //Checking the theme
  useEffect(() => {
    dispatch(fetchTodoByKey({ key: `users/${user?.uid}` })).then((data) => {
      const mainPayload = data.payload;
      setTheme(mainPayload?.theme);
      props.handleTheme(mainPayload?.theme);
    });
  }, [dispatch, user]);

  //Handling the theme changing
  const handleThemeChange = async () => {
    dispatch(fetchTodoByKey({ key: `users/${user?.uid}` }))
      .then((data) => {
        const payload = data.payload;

        const theme = payload.theme === "light" ? "dark" : "light";
        setTheme(theme);
        props.handleTheme(theme);
        const newData = { ...payload, theme: theme };
        dispatch(addTodo({ key: `users/${user?.uid}`, data: newData }));
      })
      .catch((e) => console.log(e));
  };

  return (
    // Main header section
    <header className={`header ${Theme}`}>
      <div>
        {/* Logo and heading */}
        <img src={Logo} alt="this is the logo" />
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
              {user.uid === "lNab2SzsY4bw81plNnSnKxrml7o1" && (
                <Link to="/admin" className="link">Admin</Link>
              )}

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
                className="link text-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  handleThemeChange();
                }}
                to="/"
              >
                {Theme === "light" ? (
                  <>
                    Dark Mode &ensp;
                    <i className="fa-solid fa-moon"></i>
                  </>
                ) : (
                  <>
                    Light Mode &ensp;
                    <i className="fa-solid fa-sun"></i>
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
