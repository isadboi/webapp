import { createSlice } from '@reduxjs/toolkit';

interface Iinterface {
  OpenModalInput: boolean;
  customerCard: boolean;
  salesCard: boolean;
  buysCard: boolean;
  vendorCard: boolean;
  SnackBar: { messageType: 'success'; feedback: ''; openSnackbar: false };
  Block: { blockFlag: false; blockMessage: 'Loading'; spinner: 'loader' };
  loading: boolean;
}

const initialState: Iinterface = {
  OpenModalInput: false,
  customerCard: false,
  salesCard: false,
  buysCard: false,
  vendorCard: false,
  SnackBar: { messageType: 'success', feedback: '', openSnackbar: false },
  Block: { blockFlag: false, blockMessage: 'Loading', spinner: 'loader' },
  loading: false,
};

const UiSlice = createSlice({
  initialState,
  name: 'ui',
  reducers: {
    switchLoading: (state) => {
      return {
        ...state,
        loading: !state.loading,
      };
    },
  },
});

export const { switchLoading } = UiSlice.actions;
export default UiSlice.reducer;
