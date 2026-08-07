import { RootState } from '../root-reducer';

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserChecked = (state: RootState) => state.user.checked;
export const selectIsAuthenticated = (state: RootState) => !!state.user.user;
export const selectUserError = (state: RootState) => state.user.error;
