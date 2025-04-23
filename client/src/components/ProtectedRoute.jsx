import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    // Redirect to the sign-in page if the user is not authenticated
    return <Navigate to="/signin" />;
  }

  // Render the children (protected content) if the user is authenticated
  return children;
};

export default ProtectedRoute;