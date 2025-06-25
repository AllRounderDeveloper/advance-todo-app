import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetState, Signup } from "../Slices/Auth.slice";
import { SelectorFunc } from "../config/SelectorFunc";
import toast from "react-hot-toast";
import { getUser } from "../Slices/Main.slice";

const SignupPage = (props) => {
  const { message, bool, AT } = SelectorFunc("auth", "signup");
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const refreshUser = () => dispatch(getUser());

  const submit = useCallback(
    async (formData) => {
      try {
        await dispatch(Signup({ ...formData })).unwrap();
      } catch (error) {
        setErrorMessage("An error occurred during signup.");
      } finally {
        setLoader(false);
      }
    },
    [dispatch, bool, AT, message, props, SelectorFunc]
  );

  useEffect(() => {
    if (bool) {
      setErrorMessage(null);
      localStorage.setItem("token", AT);

      refreshUser();
      props.checkTheme();
      dispatch(resetState("singup"));
      toast.success("Account Created", {
        position: "bottom-right",
        duration: 2000,
      });
    } else if (message) {
      setErrorMessage(message);
    }
    setLoader(false);
  }, [bool, message, AT, props]);

  return (
    <form
      className="container form classic-bg pa-3"
      onSubmit={handleSubmit(submit)}
    >
      <h2 className="text-center mb-4 fw-bold text-primary">
        Signup <i className="fa-solid fa-right-to-bracket"></i>
      </h2>

      {ErrorMessage && <p className="text-danger fw-bold">{ErrorMessage}</p>}
      {/* userName */}
      <div className="form-floating mb-3">
        <input
          className={`form-control ${errors.userName ? "is-invalid" : ""}`}
          type="text"
          placeholder="Enter UserName"
          {...register("userName", { required: "Required" })}
          name="userName"
        />
        <label htmlFor="userName" className="text-secondary">
          Enter UserName*{" "}
          {errors.userName && <span className="text-danger">(required)</span>}{" "}
        </label>
      </div>

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
          className={`form-control pe-5 ${errors.password ? "is-invalid" : ""}`}
          type={showPassword ? "text" : "password"}
          placeholder="Create Password"
          {...register("password", { required: "Required" })}
          name="password"
        />
        <label htmlFor="password" className="text-secondary">
          Create Password*{" "}
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
          Have An Account?{" "}
          <Link to={"/login"} onClick={() => dispatch(resetState("signup"))}>
            Login
          </Link>{" "}
        </p>
      </div>
    </form>
  );
};

export default SignupPage;
