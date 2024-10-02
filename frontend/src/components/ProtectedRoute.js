import React, { useContext } from 'react';
import { Navigate, Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    //If user is not authenticated
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
