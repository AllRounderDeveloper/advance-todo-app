import { useState, useEffect } from "react";
import { useFirebase } from "../Context/Firebase";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [Loader, setLoader] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [Error, setError] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (e) => {
    try {
      setLoader(true);
      const snap = await firebase.SignUpUserWithEmailAndPassword(
        e.email,
        e.password,
        e.userName
      );

      if (snap) {
        setLoader(false);
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (Error) {
      switch (Error) {
        case "Firebase: Error (auth/email-already-in-use).":
          seterrorMessage("User with this email already exists");
          break;
        case "Firebase: Error (auth/network-request-failed).":
          seterrorMessage("Please check your internet connection.");
          break;

        default:
          seterrorMessage(Error);
          break;
      }
    }
  }, [Error]);

  return (
    <main className="main">
      {Loader ? (
        <div className="loader"></div>
      ) : (
        <form className="form" onSubmit={handleSubmit(submit)}>
          <h3 className="mb-4">SignUp to continue</h3>
          {errorMessage && <h5 className="text-danger">{errorMessage}</h5>}

          <div className="form-floating mb-3">
            <input
              type="Text"
              className="form-control"
              id="Name"
              placeholder="Enter your E-mail"
              autoComplete="off"
              {...register("userName", { required: "Enter your name" })}
            />
            <label htmlFor="Name" className="text-secondary">
              Enter your name*
            </label>

            {errors.userName && (
              <p className="text-danger">{errors.userName.message}</p>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="Email"
              className="form-control"
              id="Email"
              placeholder="Enter your E-mail"
              autoComplete="off"
              // value={email}
              // onChange={e => setEmail(e.target.value)}
              // required
              {...register("email", { required: "Enter your email" })}
            />
            <label htmlFor="Email" className="text-secondary">
              Enter your Email*
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
              // value={password}
              // onChange={e => setPassword(e.target.value)}
              // required
              {...register("password", { required: "Enter your password" })}
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
            Sign Up &nbsp;
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </button>
          <button
            className="btn btn-outline-success container-fluid"
            type="btn"
            onClick={() => navigate("/login")}
          >
            Have an account? Login
          </button>
        </form>
      )}
    </main>
  );
};

export default SignUp;
