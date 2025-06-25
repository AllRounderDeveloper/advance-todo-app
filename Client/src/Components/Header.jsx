import toast from "react-hot-toast";
import Logo from "../assets/logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ChangePass, resetState, SignOut } from "../Slices/Auth.slice";
import { SelectorFunc } from "../config/SelectorFunc";
import { getUser, setTheme } from "../Slices/Main.slice";

const Header = ({ checkTheme }) => {
  const { user } = SelectorFunc("main", false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, bool } = SelectorFunc("auth", "signout");
  const { ChangePass_message, ChangePass_bool } = SelectorFunc(
    "auth",
    "changePass"
  );
  const { register, handleSubmit, reset } = useForm();

  const refreshUser = () => dispatch(getUser());

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Deleting the Account
  const handleDeleteAccount = async (data) => {
    const token = localStorage.getItem("token");
    await dispatch(SignOut({ deletePass: data.deletePasword, token }));
  };

  useEffect(() => {
    if (!bool && message) {
      toast.error(message, {
        position: "bottom-right",
        duration: 2000,
      });
      reset({
        deletePasword: "",
      });
      return;
    }
    if (bool) {
      localStorage.clear("token");
      navigate("/login");
      document.body.classList.remove("dark-mode");
      toast.dismiss();
      setTimeout(() => {
        refreshUser();
        toast.success("Account Deleted");
      }, 500);
      dispatch(resetState("signup"));
    }
  }, [refreshUser, message, bool]);

  const DeleteDialog = () => {
    toast((t) => (
      <>
        <form onSubmit={handleSubmit(handleDeleteAccount)}>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            {...register("deletePasword")}
          />

          <div className="mt-2 pt-2 border-top">
            <input
              type="submit"
              className="btn bg-danger btn-sm text-light"
              style={{ marginRight: "10px" }}
              value={"Delete Account"}
            />

            <input
              type="reset"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                toast.dismiss(t.id);
                reset({
                  deletePasword: "",
                });
              }}
              value={"Close"}
            />
          </div>
        </form>
      </>
    )),
      { position: "top-center", duration: Infinity };
  };

  const handleLogout = async () => {
    toast(
      (t) => (
        <div>
          <p>Do you want to Logout ?</p>

          <div className="mt-2">
            <button
              className="btn btn-sm btn-warning text-light m-1"
              onClick={async () => {
                toast.dismiss(t.id);
                localStorage.clear("token");
                refreshUser();
                navigate("/");
                document.body.classList.remove("dark-mode");
                toast.success("Logged Out", {
                  position: "bottom-right",
                  duration: 2000,
                });
              }}
            >
              Logout
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleTheme = () => dispatch(setTheme()).then(() => checkTheme());

  const handlePasswordChange = async (data) => {
    const token = localStorage.getItem("token");
    if (data.Change_newPassword !== data.Change_confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    dispatch(
      ChangePass({
        currentPassword: data.Change_currentPassword,
        newPassword: data.Change_newPassword,
        token,
      })
    );
  };

  useEffect(() => {
    try {
      if (ChangePass_bool) {
        toast.dismiss();
        toast.success("Password changed successfully");
        reset({
          Change_confirmPassword: "",
          Change_currentPassword: "",
          Change_newPassword: "",
        });
      } else if (ChangePass_message) {
        toast.error(ChangePass_message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    }
  }, [ChangePass_bool, ChangePass_message]);

  const changePasswordDialog = () => {
    toast((t) => (
      <form onSubmit={handleSubmit(handlePasswordChange)}>
        <h5 className="mb-3 fw-bold text-primary">Change Password</h5>{" "}
        {/* Current Password */}
        <div className="mb-2 position-relative">
          <input
            type="password"
            className="form-control"
            placeholder="Current Password"
            {...register("Change_currentPassword", { required: true })}
            autoComplete="off"
          />
        </div>
        {/* New Password */}
        <div className="mb-2 position-relative">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            {...register("Change_newPassword", { required: true })}
            autoComplete="off"
          />
        </div>
        {/* Confirm Password */}
        <div className="mb-3 position-relative">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            {...register("Change_confirmPassword", { required: true })}
            autoComplete="off"
          />
        </div>
        {/* Other Actions */}
        <div className="mt-2 pt-2 border-top d-flex justify-content-between">
          <input
            type="submit"
            className="btn btn-primary btn-sm"
            onClick={handleSubmit(handlePasswordChange)}
            value={"Update Password"}
          />
          <input
            type="reset"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              toast.dismiss(t.id);
            }}
            value={"Close"}
          />
        </div>
      </form>
    ));
  };

  return (
    <>
      <header className="header shadow-sm py-3 mb-4">
        <div className="container d-flex align-items-center justify-content-between">
          <a
            href="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
          >
            <img src={Logo} alt="Logo" style={{ width: 40, height: 40 }} />
            <h1 className="h4 mb-0 fw-bold text-primary">Todo List</h1>
          </a>
          {user && (
            <>
              <nav>
                <ul className="nav gap-3">
                  <li className="nav-item">
                    <Link
                      className="nav-link text-secondary fw-semibold"
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-secondary fw-semibold"
                      to="/create"
                    >
                      Add
                    </Link>
                  </li>
                  {user?.token === "" && (
                    <li className="nav-item">
                      <Link
                        className="nav-link text-secondary fw-semibold"
                        to="/admin"
                      >
                        Admin
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
              <div className="position-relative" ref={dropdownRef}>
                <button
                  className="btn btn-light border-0"
                  onClick={toggleDropdown}
                >
                  <i className="fa-solid fa-gear fa-lg text-secondary"></i>
                </button>
                {dropdownOpen && (
                  <ul
                    className="dropdown-menu position-absolute end-5 top-5 show fade-in"
                    style={{ right: "41px", top: "0px" }}
                  >
                    <li>
                      <Link
                        to={"/"}
                        className="nav-link text-secondary fw-semibold"
                      >
                        <span
                          className="dropdown-item text-info"
                          onClick={() => {
                            handleLogout();
                            toggleDropdown();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Logout{" "}
                          <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="nav-link text-secondary fw-semibold"
                      >
                        <span
                          className="dropdown-item text-danger"
                          onClick={() => {
                            DeleteDialog();
                            toggleDropdown();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Delete Account <i className="fa-solid fa-trash"></i>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <span
                        className="dropdown-item text-secondary"
                        onClick={() => {
                          handleTheme();
                          toggleDropdown();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        Change Theme <i className="fa-solid fa-cloud-sun"></i>
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="nav-link text-secondary fw-semibold"
                      >
                        <span
                          className="dropdown-item text-primary"
                          onClick={() => {
                            toggleDropdown();
                            changePasswordDialog();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Change Password <i className="fa-solid fa-lock"></i>
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
