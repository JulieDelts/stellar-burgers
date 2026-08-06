import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getUserApi,
  updateUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import {
  TIngredient,
  TOrder,
  TConstructorIngredient,
  TUser
} from '../../utils/types';

export type DataState = {
  ingredients: TIngredient[];
  ingredientsLoading: boolean;
  ingredientsError: string | null;
  feeds: TOrder[];
  total: number;
  totalToday: number;
  feedsLoading: boolean;
  feedsError: string | null;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  user: TUser | null;
  userLoading: boolean;
  userChecked: boolean;
  userError: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
};

const initialState: DataState = {
  ingredients: [],
  ingredientsLoading: false,
  ingredientsError: null,
  feeds: [],
  total: 0,
  totalToday: 0,
  feedsLoading: false,
  feedsError: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  user: null,
  userLoading: false,
  userChecked: false,
  userError: null,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('data/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка загрузки ингредиентов'
    );
  }
});

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('data/fetchFeeds', async (_, { rejectWithValue }) => {
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

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('data/createOrder', async (ingredientsIds, { rejectWithValue }) => {
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

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'data/fetchUser',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken && !refreshToken) {
      return rejectWithValue('not_authorized');
    }

    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message ||
          'Ошибка загрузки пользователя'
      );
    }
  }
);

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('data/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(userData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка входа'
    );
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('data/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(userData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка регистрации'
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'data/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка выхода'
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('data/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка загрузки заказов'
    );
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('data/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message ||
        'Ошибка обновления пользователя'
    );
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearIngredientsError: (state) => {
      state.ingredientsError = null;
    },
    clearFeedsError: (state) => {
      state.feedsError = null;
    },
    addIngredientToConstructor: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredientFromConstructor: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const item = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] = item;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        const item = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] = item;
      }
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.userError = null;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    clearUserError: (state) => {
      state.userError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.ingredientsLoading = true;
        state.ingredientsError = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredientsLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.ingredientsLoading = false;
        state.ingredientsError =
          action.payload || 'Ошибка загрузки ингредиентов';
      })
      // Feeds
      .addCase(fetchFeeds.pending, (state) => {
        state.feedsLoading = true;
        state.feedsError = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feedsLoading = false;
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feedsLoading = false;
        state.feedsError = action.payload || 'Ошибка загрузки ленты';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
          state.constructorItems.bun = null;
          state.constructorItems.ingredients = [];
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Ошибка создания заказа';
      })
      .addCase(fetchUser.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.userLoading = false;
        state.userChecked = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userChecked = true;
        state.user = null;
        if (action.payload && action.payload !== 'not_authorized') {
          state.userError = action.payload;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.userLoading = false;
        state.userChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userChecked = true;
        state.userError = action.payload || 'Ошибка входа';
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.userLoading = false;
          state.userChecked = true;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userChecked = true;
        state.userError = action.payload || 'Ошибка регистрации';
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userLoading = false;
        state.userChecked = true;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userChecked = true;
        state.userError = action.payload || 'Ошибка выхода';
        state.user = null;
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
      .addCase(updateUser.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.userLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.payload || 'Ошибка обновления пользователя';
      });
  }
});

export const {
  clearIngredientsError,
  clearFeedsError,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientUp,
  moveIngredientDown,
  setBun,
  clearConstructor,
  clearOrderModalData,
  clearUser,
  setUser,
  clearUserError
} = dataSlice.actions;

export default dataSlice;
