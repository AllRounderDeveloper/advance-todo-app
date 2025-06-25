import React from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "./Firebase";

const RouteRestrictSign = (props) => {
    const firebase = useFirebase();
    const user = firebase.user;

    if (firebase.isLoading) {
        return <div className="loader"></div>;
    }

    return user ? <Navigate to={"/"} replace /> : props.element;
}

export default RouteRestrictSign;