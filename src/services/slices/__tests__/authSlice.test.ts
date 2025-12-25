import authReducer, {
  loginUser,
  registerUser,
  logoutUser,
  checkUserAuth,
  clearError,
  initialState
} from '../authSlice';
import { TUser } from '@utils-types';
import * as burgerApi from '@api';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => null)
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('authSlice async actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('loginUser', () => {
    it('should handle pending state', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.loginUserApi as jest.Mock).mockResolvedValue({
        success: true,
        accessToken: 'Bearer token123',
        refreshToken: 'refresh123',
        user: mockUser
      });

      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('should handle pending state', () => {
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.registerUserApi as jest.Mock).mockResolvedValue({
        success: true,
        accessToken: 'Bearer token123',
        refreshToken: 'refresh123',
        user: mockUser
      });

      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logoutUser', () => {
    it('should handle fulfilled state', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = authReducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('checkUserAuth', () => {
    it('should handle pending state', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should handle fulfilled state', () => {
      (burgerApi.getUserApi as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser
      });

      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle rejected state', () => {
      const action = {
        type: checkUserAuth.rejected.type,
        error: { message: 'Пользователь не авторизован' }
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };
      const action = clearError();
      const state = authReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });
});

