import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
// pages

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SignIn from '../pages/Authentication/SignIn';

// ----------------------------------------------------------------------

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null,
  );

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <SignIn />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);

    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
