import feedsReducer, { fetchFeeds, initialState } from '../feedsSlice';
import { TOrdersData } from '@utils-types';
import * as burgerApi from '@api';

const mockFeedsData: TOrdersData = {
  orders: [
    {
      _id: '64e3e7dbc5b9c1001c6e6c9e',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
      status: 'done',
      name: 'Краторный space бургер',
      createdAt: '2023-08-22T10:00:00.000Z',
      updatedAt: '2023-08-22T10:00:00.000Z',
      number: 12345
    }
  ],
  total: 100,
  totalToday: 10
};

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedsSlice async actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFeeds', () => {
    it('should handle pending state', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsData);

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      };
      const state = feedsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockFeedsData);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.data).toBeNull();
    });

    it('should set default error message when error message is missing', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: {}
      };
      const state = feedsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ленты заказов');
    });
  });
});



