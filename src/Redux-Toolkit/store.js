// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import permissonReducer from './Slices/permissonSlice';

export const store = configureStore({
  reducer: {
    permission:permissonReducer
  },
});
