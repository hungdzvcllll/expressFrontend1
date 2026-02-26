import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired,getUserRole } from "./auth";

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole(token);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;