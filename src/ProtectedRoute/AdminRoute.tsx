import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import authService from "../services/authService";

interface PropType {
  component: React.FC;
  props?: any;
}

const AdminRoute: FC<PropType> = ({ component: Component, props }) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (!authService.isAuthenticated()) {
    return <Navigate to='/login' />;
  }

  if (!user) {
    return <div className='text-white'>Loading...</div>;
  }

  if (user.role !== "admin") {
    return <Navigate to='/dashboard' />;
  }

  return <Component {...props} />;
};

export default AdminRoute;
