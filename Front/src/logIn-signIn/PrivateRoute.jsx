import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in, render the protected page
  return children;
};

export default PrivateRoute;
