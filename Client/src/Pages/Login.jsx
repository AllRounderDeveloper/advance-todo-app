import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { LoginFunc, resetState } from "../Slices/Auth.slice";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { SelectorFunc } from "../config/SelectorFunc";
import toast from "react-hot-toast";
import { getUser } from "../Slices/Main.slice";

const Login = (props) => {
  const [ErrorMessage, setErrorMessage] = useState();
  const dispatch = useDispatch();
  const { message, bool, AT } = SelectorFunc("auth", "login");
  const [Loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const refreshUser = () => dispatch(getUser());

  const submit = async (data) => {
    try {
      setLoader(true);
      await dispatch(LoginFunc({ ...data })).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!bool) {
      setErrorMessage(message);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
      return;
    }

    dispatch(resetState("login"));
    setErrorMessage(null);
    localStorage.setItem("token", AT);
    setTimeout(() => {
      setLoader(false);
      refreshUser();
      props.checkTheme();
      toast.success("Welcome Back", {
        position: "bottom-right",
        duration: 2000,
      });
    }, 500);
  }, [bool, message, AT, props]);

  return (
    <>
      <form
        className="container form classic-bg pa-3"
        onSubmit={handleSubmit(submit)}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">
          Login <i className="fa-solid fa-right-to-bracket"></i>
        </h2>

        {ErrorMessage && <p className="text-danger fw-bold">{ErrorMessage}</p>}

        {/* Email */}
        <div className="form-floating mb-3">
          <input
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            type="email"
            placeholder="Enter Email"
            {...register("email", { required: "Required" })}
            name="email"
          />
          <label htmlFor="email" className="text-secondary">
            Enter Email*{" "}
            {errors.email && <span className="text-danger">(required)</span>}{" "}
          </label>
        </div>

        {/* Password */}
        <div className="form-floating mb-3 position-relative">
          <input
            className={`form-control pe-5 ${
              errors.password ? "is-invalid" : ""
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            {...register("password", { required: "Required" })}
            name="password"
          />
          <label htmlFor="password" className="text-secondary">
            Enter Password*{" "}
            {errors.password && <span className="text-danger">(required)</span>}
          </label>

          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer", zIndex: "5" }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              title={showPassword ? "Hide password" : "Show password"}
            ></i>
          </span>
        </div>

        {/* Other actions */}
        <div className="actions">
          {!Loader ? (
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary container-fluid mb-4"
            />
          ) : (
            <button
              className="btn btn-primary container-fluid mb-4"
              type="button"
              disabled
            >
              <span
                className="spinner-grow spinner-grow-sm"
                aria-hidden="true"
              ></span>
              <span role="status">Loading...</span>
            </button>
          )}
          <p className="container-fluid text-center">
            Not Have An Account?{" "}
            <Link to={"/signup"} onClick={() => dispatch(resetState("login"))}>
              SignUp
            </Link>{" "}
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
