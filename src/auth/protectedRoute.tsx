import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired,getUserRole } from "./auth";
import { useLocation } from "react-router-dom";
interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get("token");

  // 1. Nếu có token từ URL → lưu vào localStorage
  if (tokenFromUrl) {
    localStorage.setItem("token", tokenFromUrl);
  }

  const token = localStorage.getItem("token");
  console.log(token);
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