import React, { useState, useEffect } from "react";
import { useFirebase } from "../Context/Firebase";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [Loader, setLoader] = useState(true);
  const [errorMessage, seterrorMessage] = useState("");
  const [IsBlocked, setIsBlocked] = useState(false);
  const [Email, setEmail] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const func = async () => {
      if (Email) {
        const snap = await firebase.CheckBlocked(Email);
        snap.forEach((doc) => {
          const data = doc.data();
          setIsBlocked(data.block);
        });
      }
    };
    func();
  }, [Email, firebase]);

  const EmailAndPassword = async (e) => {
    if (IsBlocked) {
      seterrorMessage("You are blocked by the admin.");
      return;
    }
    await firebase.SignInWithEmailAndPassword(e.email, e.password);

    seterrorMessage("");
    setLoader(true);
    navigate("/");
  };

  const GoogleLogin = () => {
    firebase.SignInWithGoogle().then(() => navigate("/"));
  };

  if (Loader) {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }

  useEffect(() => {
    if (firebase.error) {
      switch (firebase.error) {
        case "Firebase: Error (auth/invalid-credential).":
          seterrorMessage("Email or password is incorrect.");
          break;
        case "Firebase: Error (auth/network-request-failed).":
          seterrorMessage("Please check your internet connection.");
          break;

        default:
          seterrorMessage(firebase.error);
      }
    }
  }, [firebase]);

  return (
    <main className="main">
      {Loader ? (
        <div className="loader"></div>
      ) : (
        <form className="form" onSubmit={handleSubmit(EmailAndPassword)}>
          <h3 className="mb-4">Login to continue</h3>
          {errorMessage && <h5 className="text-danger">{errorMessage}</h5>}

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

          <button className="btn btn-primary container-fluid" type="Submit">
            Login &nbsp;
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </button>

          <button
            className="btn btn-outline-secondary container-fluid mt-3 mb-3"
            type="btn"
            onClick={GoogleLogin}
          >
            Login with Google
            <img
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt=""
            />
          </button>

          <button
            className="btn btn-outline-success container-fluid"
            type="btn"
            onClick={() => navigate("/signup")}
          >
            Not have an account? SignUp
          </button>
        </form>
      )}
    </main>
  );
};

export default Login;
