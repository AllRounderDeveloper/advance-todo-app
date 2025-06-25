import { Navigate } from "react-router-dom";
import { useFirebaseUser } from "../config/FirebaseFunc";

const RouteRes = ({ element }) => {
  const userData = useFirebaseUser();

  if (userData.Loading) {
    return <div className="Loader"></div>;
  }

  return userData.user
    ? element
    : <Navigate to="/login" /> || <Navigate to="/signup" />;
};

export default RouteRes;
