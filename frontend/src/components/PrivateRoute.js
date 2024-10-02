import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ roles }) {
  const { auth } = React.useContext(AuthContext);

  if (!auth || !auth.token) {
    //If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

   if (roles && (!auth.user || !roles.includes(auth.user.role))) {
    //If not authorized or auth.user is undefined, redirect to unauthorized page
    return <Navigate to="/unauthorized" />;
  }
  // authorized, render child routes
  return <Outlet />;
}

export default PrivateRoute;
