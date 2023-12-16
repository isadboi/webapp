import jwtDecode from 'jwt-decode';
import api from '../../utils/api';
import store, { AppDispatch } from '../store';
import { getUsers, loginSuccess, signOut, userLoaded } from '../reducers/auth';
import { switchLoading } from '../reducers/ui';
import toast from 'react-hot-toast';
import { getAllTransactions } from './transactions';
import { resetTransactoins } from '../reducers/transactions';

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    const body = { email, password };
    try {
      dispatch(switchLoading());
      const res: any = await api.post('/auth/login', body);

      toast.success('Successfully Logged In!');

      const user: any = await jwtDecode(res.data.token);

      console.log(user);

      dispatch(loginSuccess({ ...res.data, user }));

      console.log('helloo');

      await dispatch(getUser());

      dispatch(switchLoading());
    } catch (err: any) {
      toast.error(err.response.data?.errors?.msg || 'Login Failed!');
      dispatch(switchLoading());
      console.log(err);
    }
  };

// export const renewToken = () => async (dispatch: AppDispatch) => {
//   try {
//     const res: any = await api.get('/auth/renewtoken');
//     const user: any = jwtDecode(res.data.token);

//     dispatch({
//       type: 'LOGIN_SUCCESS',
//       payload: { ...res.data, ...user },
//     });
//     dispatch(getUser());
//   } catch (err) {
//     console.log(err);
//     dispatch({ type: 'AUTH_ERROR' });
//   }
// };

export const getUser = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(switchLoading());
    let res = await api.get('/user/');

    console.log(res.data);

    dispatch(userLoaded(res.data));
    await dispatch(getAllTransactions());
    const { role } = store.getState().auth.user;

    if (role === 'admin') {
      await dispatch(getAllUser());
    }

    dispatch(switchLoading());
  } catch (err: any) {
    dispatch(switchLoading());

    toast.error(
      err.response.data.errors.msg ||
        'Failed To load user. Kindly logout and login',
    );
  }
};

export const getAllUser = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(switchLoading());
    let res = await api.get('/user/get-all-users');

    dispatch(getUsers(res.data));

    dispatch(switchLoading());
  } catch (err: any) {
    dispatch(switchLoading());
    toast.error(
      err.response.data.errors.msg ||
        'Failed To load All user. Kindly logout and login',
    );
  }
};

export const signup = (body: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(switchLoading());

    await api.post('/auth/register', body);

    dispatch(switchLoading());

    toast.success(
      'Successfully Registered! Check your email for verification in order to continue',
    );
  } catch (err: any) {
    dispatch(switchLoading());
    console.log(err);

    toast.error(err.response.data?.errors?.msg);
  }
};

export const updatePass = (pass: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: 'BLOCK_MAIN',
      payload: {
        blockFlag: true,
        blockMessage: 'Updating',
      },
    });
    await api.post('/auth/updatePassword', pass);

    dispatch({
      type: 'UNBLOCK_MAIN',
    });
    dispatch({
      type: 'SHOW_SNACKBAR',
      payload: {
        messageType: 'success',
        feedback: 'Successfully Updated Password',
        openSnackbar: true,
      },
    });
  } catch (err) {
    dispatch({
      type: 'UNBLOCK_MAIN',
    });
    dispatch({
      type: 'SHOW_SNACKBAR',
      payload: {
        messageType: 'error',
        feedback: 'Wrong Current Password',
        openSnackbar: true,
      },
    });
  }
};

export const resetPasswordRequest =
  (email: any) => async (dispatch: AppDispatch) => {
    try {
      const body = { email: email };
      dispatch(switchLoading());
      await api.post('/auth/forgotpassword', body);
      dispatch(switchLoading());

      toast.success('Successfully Sent Reset Password Request');
    } catch (err: any) {
      dispatch(switchLoading());
      toast.error(err?.response?.data?.errors?.msg);
    }
  };

export const resetPassword =
  (newPassword: string, token: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch({
        type: 'BLOCK_MAIN',
        payload: {
          blockFlag: true,
          blockMessage: 'Changing Password ',
        },
      });

      await api.post('/auth/resetpassword', { newPassword, token });

      dispatch({
        type: 'UNBLOCK_MAIN',
      });
      dispatch({
        type: 'SHOW_SNACKBAR',
        payload: {
          messageType: 'success',
          feedback: 'Successfully Changed Password',
          openSnackbar: true,
        },
      });
    } catch (err: any) {
      dispatch({
        type: 'UNBLOCK_MAIN',
      });
      dispatch({
        type: 'SHOW_SNACKBAR',
        payload: {
          messageType: 'error',
          feedback: err?.response?.data?.errors?.msg,
          openSnackbar: true,
        },
      });
    }
  };

export const logout = () => async (dispatch: AppDispatch) => {
  dispatch(signOut());
  dispatch(resetTransactoins());
};
