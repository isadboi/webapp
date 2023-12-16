import axios from 'axios';
import store from '../redux/store';
import { logout } from '../redux/actions/auth';
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

api.interceptors.response.use(
  (res: any) => res,
  (err: any) => {
    if (err.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err);
  },
);

export default api;
