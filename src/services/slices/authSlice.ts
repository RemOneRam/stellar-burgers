import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export interface AuthState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!getCookie('accessToken')
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.success) {
      const token = response.accessToken.startsWith('Bearer ')
        ? response.accessToken.split('Bearer ')[1]
        : response.accessToken;
      setCookie('accessToken', token, {
        expires: 1200
      });
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
    throw new Error('Ошибка авторизации');
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response.success) {
      const token = response.accessToken.startsWith('Bearer ')
        ? response.accessToken.split('Bearer ')[1]
        : response.accessToken;
      setCookie('accessToken', token, {
        expires: 1200
      });
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    }
    throw new Error('Ошибка регистрации');
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkUserAuth = createAsyncThunk('auth/checkUser', async () => {
  const accessToken = getCookie('accessToken');
  if (!accessToken) {
    throw new Error('Пользователь не авторизован');
  }
  const response = await getUserApi();
  if (response.success) {
    return response.user;
  }
  throw new Error('Ошибка получения данных пользователя');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
