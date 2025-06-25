import { Navigate } from "react-router-dom";
import { SelectorFunc } from "./SelectorFunc";

const SignupRes = ({ element, loader }) => {
  const { user } = SelectorFunc("main", false);

  if (loader)
    return (
      <div className="modern-center-container">
        <div className="loader-circle"></div>
        <span className="loader-text">Loading...</span>
      </div>
    );

  return !user || user.length === 0 ? element : <Navigate to="/" />;
};

export default SignupRes;
