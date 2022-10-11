import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

/** Redux store */
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

/** Redux store state Type */
export type RootState = ReturnType<typeof store.getState>;