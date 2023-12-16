import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import uiReducer from './reducers/ui';
import transactionReducer from './reducers/transactions';
import setAuthToken from '../utils/setAuthToken';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    transaction: transactionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
let currentState = store.getState();

store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState();
  // if the token changes set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token: any = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;

export type AppDispatch = typeof store.dispatch;
