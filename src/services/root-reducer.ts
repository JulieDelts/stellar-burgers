import { combineReducers } from '@reduxjs/toolkit';
import dataSlice from './slices/data-slice';

export const rootReducer = combineReducers({
  data: dataSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
