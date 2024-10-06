import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token"); // Example of checking for a token

  if (!token) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
