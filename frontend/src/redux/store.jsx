import { configureStore } from '@reduxjs/toolkit';
import chitChatSlice from './ecomSlice'

export const store = configureStore({
  reducer: {
    chitChat:chitChatSlice
  },
});