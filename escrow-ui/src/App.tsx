import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import setAuthToken from './utils/setAuthToken';
import { getUser, logout } from './redux/actions/auth';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { loginSuccess } from './redux/reducers/auth';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import GuestGuard from './guards/GuestGuard';
import AuthGuard from './guards/AuthGuard';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const Users = lazy(() => import('./pages/Users'));
const ECommerce = lazy(() => import('./pages/Dashboard/ECommerce'));

function App() {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.ui.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  let interval: any = 0;

  const checkExpiry = () => {
    const token = localStorage.token;
    if (token) {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch(logout());
        window.location.href = '/auth/signin';
      } else {
        if (interval !== 0) {
          clearTimeout(interval);
        }
        interval = setTimeout(
          checkExpiry,
          decodedToken.exp * 1000 - Date.now(),
        );
      }
    }
  };

  const checkAdmin = (route: any): any => {
    if (user?.role === 'admin') {
      route.splice(1, 0, {
        path: '/users',
        title: 'All Users',
        component: Users,
      });
    }

    return route;
  };

  React.useEffect(() => {
    // check for token in LS and load user
    if (localStorage.token) {
      dispatch(loginSuccess({ user: jwtDecode(localStorage.token) }));
      setAuthToken(localStorage.token);
    }

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) {
        clearTimeout(interval);
        dispatch(logout());
      }
    });
  }, [dispatch, interval]);
  checkExpiry();

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{ duration: 5000 }}
        containerClassName="z-999999"
      />

      <Loader loading={loading} />

      <Routes>
        <Route
          path="/auth/signin"
          element={
            <GuestGuard>
              <SignIn />
            </GuestGuard>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <GuestGuard>
              <SignUp />
            </GuestGuard>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          }
        />
        <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
        <Route
          element={
            <AuthGuard>
              <Suspense fallback={<Loader loading={true} />}>
                <DefaultLayout />
              </Suspense>
            </AuthGuard>
          }
        >
          <Route index element={<ECommerce />} />
          {checkAdmin(routes).map(
            ({ path, component: Component }: any, i: number) => (
              <Route key={i} path={path} element={<Component />} />
            ),
          )}
        </Route>
      </Routes>
    </>
  );
}

export default App;
