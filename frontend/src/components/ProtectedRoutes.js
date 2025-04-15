import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const token = localStorage.getItem("refreshToken");
  return token ? <Outlet /> : <Navigate to="/login/" replace />;
}
