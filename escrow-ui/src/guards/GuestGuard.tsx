import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// hooks
// pages

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SignIn from '../pages/Authentication/SignIn';

// ----------------------------------------------------------------------

const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return <>{children}</>;
};

export default GuestGuard;
