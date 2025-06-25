import { Navigate } from "react-router-dom";
import { useFirebaseUser } from "../config/FirebaseFunc";

const SignUpRes = ({ element }) => {
  const userData = useFirebaseUser();

  if (userData.Loading) {
    return <div className="Loader"></div>;
  }

  return userData.user ? <Navigate to="/" /> : element;
};

export default SignUpRes;
