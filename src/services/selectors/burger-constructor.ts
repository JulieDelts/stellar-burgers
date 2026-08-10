import { RootState } from '../root-reducer';

export const selectConstructorItems = (state: RootState) => ({
  bun: state.burgerConstructor.bun,
  ingredients: state.burgerConstructor.ingredients
});
export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
