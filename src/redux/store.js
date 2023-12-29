import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import wells from './wells';
import loading from './loading';

export const store = configureStore({
  reducer: { user, wells, loading }
});
