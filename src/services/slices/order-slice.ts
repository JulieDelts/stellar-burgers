import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export type OrderState = {
  orderRequest: boolean;
  orderRequestModalData: TOrder | null;
  orderRequestError: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
  userCurrentOrder: TOrder | null;
  userCurrentOrderLoading: boolean;
  userCurrentOrderError: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderRequestModalData: null,
  orderRequestError: null,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,
  userCurrentOrder: null,
  userCurrentOrderLoading: false,
  userCurrentOrderError: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredientsIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientsIds);
    const order: TOrder = {
      _id: response.order._id,
      status: response.order.status,
      name: response.order.name,
      createdAt: response.order.createdAt,
      updatedAt: response.order.updatedAt,
      number: response.order.number,
      ingredients: ingredientsIds
    };
    return order;
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка создания заказа'
    );
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка загрузки заказов'
    );
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders.length > 0) {
      return response.orders[0];
    }
    return rejectWithValue('Заказ не найден');
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка загрузки заказа'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderRequestModalData = null;
      state.orderRequestError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderRequestError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderRequestModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderRequestError = action.payload || 'Ошибка создания заказа';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersLoading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError = action.payload || 'Ошибка загрузки заказов';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.userCurrentOrderLoading = true;
        state.userCurrentOrderError = null;
        state.userCurrentOrder = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.userCurrentOrderLoading = false;
          state.userCurrentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.userCurrentOrderLoading = false;
        state.userCurrentOrderError =
          action.payload || 'Ошибка загрузки заказа';
        state.userCurrentOrder = null;
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export default orderSlice;
