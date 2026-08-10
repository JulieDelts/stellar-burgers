import { RootState } from '../root-reducer';

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderRequestModalData = (state: RootState) =>
  state.order.orderRequestModalData;
export const selectOrderRequestError = (state: RootState) =>
  state.order.orderRequestError;
export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.order.userOrdersLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.order.userOrdersError;
export const selectUserCurrentOrder = (state: RootState) =>
  state.order.userCurrentOrder;
export const selectUserCurrentOrderLoading = (state: RootState) =>
  state.order.userCurrentOrderLoading;
export const selectUserCurrentOrderError = (state: RootState) =>
  state.order.userCurrentOrderError;
