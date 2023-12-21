import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import wells from './wells';

export const store = configureStore({
  reducer: { user, wells }
});
