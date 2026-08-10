import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return {
      orders: response.orders,
      total: response.total,
      totalToday: response.totalToday
    };
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка загрузки ленты'
    );
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки ленты';
      });
  }
});

export const { clearError } = feedSlice.actions;
export default feedSlice;
