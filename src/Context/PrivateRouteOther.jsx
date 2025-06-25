import React from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "./Firebase";

const RouteRestrict = (props) => {
    const firebase = useFirebase()
    const user = firebase.user

    if (firebase.isLoading) {
        return <div className="loader"></div>;
    }

    return !user ? <Navigate to="/login" /> || <Navigate to="/signup" /> : props.element;
};

export default RouteRestrict;