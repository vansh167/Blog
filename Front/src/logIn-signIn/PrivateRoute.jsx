import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isAuthed = Boolean(user) || Boolean(token);

  // If not authenticated, redirect to auth page and preserve intended path
  if (!isAuthed) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
