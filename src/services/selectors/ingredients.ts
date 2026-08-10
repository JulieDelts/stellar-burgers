import { RootState } from '../root-reducer';

export const selectIngredients = (state: RootState) => state.ingredients.data;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
