import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, allowedRole }) => {
  const userRole = localStorage.getItem("role"); // admin or client

  if (userRole === allowedRole) {
    return <Component />;
  } else {
    return <Navigate to="/access-denied" replace />;
  }
};

export default ProtectedRoute;