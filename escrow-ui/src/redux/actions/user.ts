import toast from 'react-hot-toast';
import api from '../../utils/api';
import { switchLoading } from '../reducers/ui';
import { AppDispatch } from '../store';
import { getUser } from './auth';

export const updateUser = (body: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(switchLoading());
    const res: any = await api.post('/user', body);

    toast.success(res.data || 'Successfully updated profile!');
    await dispatch(getUser());

    dispatch(switchLoading());
  } catch (err: any) {
    dispatch(switchLoading());
    console.log(err);

    toast.error(err.response.data?.errors?.msg || 'Login Failed!');
  }
};
