import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

/** Create redux store */
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

/** Export store state Type */
export type RootState = ReturnType<typeof store.getState>;