import { createSlice } from '@reduxjs/toolkit';

interface IinitialState {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  user: any;
  rediectToLogin: boolean | null;
  allusers: any;
}

const initialState: IinitialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: false,
  user: null,
  rediectToLogin: false,
  allusers: undefined,
};

const AuthSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    userLoaded: (state, { payload }) => {
      console.log(payload);

      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
      };
    },
    setUser: (state, { payload }) => {
      return {
        ...state,
        loading: false,
        user: payload,
      };
    },

    getUsers: (state, { payload }) => {
      return {
        ...state,
        allusers: payload,
        loading: false,
      };
    },
    loginSuccess: (state, { payload }) => {
      console.log(payload);

      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    },

    signOut: (state) => {
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    },
  },
});

export const { loginSuccess, getUsers, signOut, setUser, userLoaded } =
  AuthSlice.actions;

export default AuthSlice.reducer;
