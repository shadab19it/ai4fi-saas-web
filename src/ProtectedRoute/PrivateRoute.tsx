import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

interface PropType {
  component: React.FC;
}

const PrivateRoute: FC<PropType> = ({ component: Component }) => {
  if (authService.isAuthenticated() && authService.isAdmin()) return <Component />;
  return <Navigate to='/login' />;
};

export default PrivateRoute;
