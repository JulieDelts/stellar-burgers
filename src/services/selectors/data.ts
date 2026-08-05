import { RootState } from '../root-reducer';

export const selectIngredients = (state: RootState) => state.data.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.data.ingredientsLoading;
export const selectIngredientsError = (state: RootState) =>
  state.data.ingredientsError;

export const selectFeeds = (state: RootState) => state.data.feeds;
export const selectFeedsTotal = (state: RootState) => state.data.total;
export const selectFeedsTotalToday = (state: RootState) =>
  state.data.totalToday;
export const selectFeedsLoading = (state: RootState) => state.data.feedsLoading;
export const selectFeedsError = (state: RootState) => state.data.feedsError;

export const selectConstructorItems = (state: RootState) =>
  state.data.constructorItems;
export const selectConstructorBun = (state: RootState) =>
  state.data.constructorItems.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.data.constructorItems.ingredients;
export const selectOrderRequest = (state: RootState) => state.data.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.data.orderModalData;
export const selectOrderError = (state: RootState) => state.data.orderError;

export const selectUser = (state: RootState) => state.data.user;
export const selectUserLoading = (state: RootState) => state.data.userLoading;
export const selectUserError = (state: RootState) => state.data.userError;
