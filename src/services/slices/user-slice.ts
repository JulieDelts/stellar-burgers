import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

export type UserState = {
  user: TUser | null;
  loading: boolean;
  checked: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  loading: false,
  checked: false,
  error: null
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
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
>('user/login', async (userData, { rejectWithValue }) => {
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
>('user/register', async (userData, { rejectWithValue }) => {
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
  'user/logout',
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

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userData, { rejectWithValue }) => {
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

export const forgotPassword = createAsyncThunk<
  { success: boolean },
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await forgotPasswordApi({ email });
    return { success: response.success };
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка восстановления пароля'
    );
  }
});

export const resetPassword = createAsyncThunk<
  { success: boolean },
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async ({ password, token }, { rejectWithValue }) => {
  try {
    const response = await resetPasswordApi({ password, token });
    return { success: response.success };
  } catch (error) {
    return rejectWithValue(
      (error as { message?: string }).message || 'Ошибка сброса пароля'
    );
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = null;
        if (action.payload && action.payload !== 'not_authorized') {
          state.error = action.payload;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.error = action.payload || 'Ошибка входа';
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.error = action.payload || 'Ошибка регистрации';
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.checked = true;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.error = action.payload || 'Ошибка выхода';
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка обновления пользователя';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка восстановления пароля';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка сброса пароля';
      });
  }
});

export const { clearUser, setUser, clearError } = userSlice.actions;
export default userSlice;
