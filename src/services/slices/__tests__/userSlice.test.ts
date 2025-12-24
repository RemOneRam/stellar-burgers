import userReducer, {
  fetchUser,
  clearUser,
  initialState
} from '../userSlice';
import { TUser } from '@utils-types';
import * as burgerApi from '@api';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

jest.mock('@api', () => ({
  getUserApi: jest.fn()
}));

describe('userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUser async actions', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.getUserApi as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser
      });

      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Ошибка получения данных пользователя';
      const action = {
        type: fetchUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });

    it('should set default error message when error message is missing', () => {
      const action = {
        type: fetchUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки данных пользователя');
    });
  });

  describe('clearUser', () => {
    it('should clear user', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      const action = clearUser();
      const state = userReducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });
  });
});

