import { createSlice } from '@reduxjs/toolkit';

interface IinitialState {
  transactions: any;
}

const initialState: IinitialState = {
  transactions: [],
};

const TransactionSlice = createSlice({
  initialState,
  name: 'transactions',
  reducers: {
    getTransactoins: (state, { payload }) => {
      return {
        ...state,
        transactions: payload,
      };
    },

    resetTransactoins: () => {
      return {
        transactions: [],
      };
    },
  },
});

export const { getTransactoins, resetTransactoins } = TransactionSlice.actions;

export default TransactionSlice.reducer;
