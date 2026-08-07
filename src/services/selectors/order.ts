import { RootState } from '../root-reducer';

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderError = (state: RootState) => state.order.orderError;
export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.order.userOrdersLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.order.userOrdersError;
