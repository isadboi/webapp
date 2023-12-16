import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getTransactoins } from '../reducers/transactions';
import { switchLoading } from '../reducers/ui';
import { AppDispatch } from '../store';

export const getAllTransactions = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(switchLoading());

    const res: any = await api.get('/transaction/');

    dispatch(getTransactoins(res.data));

    dispatch(switchLoading());
  } catch (error: any) {
    dispatch(switchLoading());
    console.log(error);

    toast.error(error.response.data.msg);
  }
};

export const createTransactions =
  (body: any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(switchLoading());

      const res: any = await api.post('/transaction/', body);

      dispatch(getTransactoins(res.data));

      dispatch(switchLoading());
    } catch (error: any) {
      dispatch(switchLoading());
      console.log(error);

      toast.error(error.response.data?.errors?.msg);
    }
  };

export const updateTransactions =
  (body: any, transactionId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(switchLoading());

      const res: any = await api.put(
        `/transaction/${transactionId}/status`,
        body,
      );

      dispatch(getAllTransactions());

      dispatch(switchLoading());
    } catch (error: any) {
      dispatch(switchLoading());
      console.log(error);

      toast.error(error.response.data?.errors?.msg);
    }
  };
