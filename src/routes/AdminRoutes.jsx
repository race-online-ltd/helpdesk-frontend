import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MainContent } from "../modules/admin/layout/MainContent";


export const AdminRoutes = () => {
  // const isAuthenticated = Boolean(sessionStorage.getItem("user"));
  const isAuthenticated = Boolean(localStorage.getItem("user"));
  if (!isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <MainContent>
      <Outlet />
    </MainContent>
  );
};
