import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredients-slice';
import burgerConstructorSlice from './slices/burger-constructor-slice';
import orderSlice from './slices/order-slice';
import feedSlice from './slices/feed-slice';
import userSlice from './slices/user-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  order: orderSlice.reducer,
  feed: feedSlice.reducer,
  user: userSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
