import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../Slice/LoginSignupSlice";
import { checkBlockOrNot } from "../Slice/AdminSlice";

const LoginPage = () => {
  //Declaring variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const Block = useSelector((state) => state.Admin.block);
  const [Email, setEmail] = useState();
  const [Error, setError] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Check if user is blocked
  const CheckBlock = useCallback(
    (email) => {
      if (email) {
        dispatch(checkBlockOrNot({ email: email }));
      }
    },
    [dispatch, checkBlockOrNot]
  );

  useEffect(() => {
    if (Email) {
      CheckBlock(Email);
    }
  }, [Email, CheckBlock]);

  //Login With Email and Password
  const Submit = async (e) => {
    setErrorMessage("");
    if (Block) {
      setErrorMessage("You are blocked by Admin");
      return;
    }
    setLoader(true);
    try {
      const res = await dispatch(
        Login({ email: e.email, password: e.password })
      );
      setError(res.payload);
      setLoader(true);
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoader(false);
    }
  };

  //Loading condition
  useEffect(() => {
    if (Loader) {
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    }
  }, [Loader]);

  //Handling the errors
  useEffect(() => {
    if (Error) {
      switch (Error) {
        case "Firebase: Error (auth/invalid-credential).":
          setErrorMessage("Email or password is incorrect.");
          break;
        case "Firebase: Error (auth/network-request-failed).":
          setErrorMessage("Please check your internet connection.");
          break;
        default:
          setErrorMessage(Error || "Login failed. Please try again.");
      }
    }
  }, [Error]);

  return (
    <main className="main">
      {Loader ? (
        <div className="loader"></div>
      ) : (
        <form className="form" onSubmit={handleSubmit(Submit)}>
          <h3 className="mb-4">Login to continue</h3>

          <strong className="text-danger">{ErrorMessage}</strong>

          <div className="form-floating mb-3">
            <input
              type="Email"
              className="form-control"
              id="Email"
              placeholder="Enter your E-mail"
              autoComplete="off"
              {...register("email", { required: "Please enter email" })}
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="Email" className="text-secondary">
              Enter your Email
            </label>
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="Password"
              className="form-control"
              id="Password"
              placeholder="Enter your Password"
              autoComplete="off"
              {...register("password", { required: "Please enter password" })}
            />
            <label htmlFor="Password" className="text-secondary">
              Enter your Password
            </label>
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>

          <button
            className="btn btn-primary container-fluid mb-3"
            type="Submit"
          >
            Login &nbsp;
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </button>

          <input
            className="btn btn-outline-success container-fluid"
            type="btn"
            onClick={() => navigate("/signup")}
            defaultValue={" Not have an account? SignUp"}
          />
        </form>
      )}
    </main>
  );
};

export default LoginPage;
