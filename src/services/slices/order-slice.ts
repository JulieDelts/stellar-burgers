import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
    clearUserOrders: (state) => {
      state.userOrders = [];
      state.userOrdersError = null;
    },
    clearUserOrdersError: (state) => {
      state.userOrdersError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Ошибка создания заказа';
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
      });
  }
});

export const { clearOrderModalData, clearUserOrders, clearUserOrdersError } =
  orderSlice.actions;

export default orderSlice;
