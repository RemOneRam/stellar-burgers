import ordersReducer, { fetchOrders, initialState } from '../ordersSlice';
import { TOrder } from '@utils-types';
import * as burgerApi from '@api';

const mockOrders: TOrder[] = [
  {
    _id: '64e3e7dbc5b9c1001c6e6c9e',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
    status: 'done',
    name: 'Краторный space бургер',
    createdAt: '2023-08-22T10:00:00.000Z',
    updatedAt: '2023-08-22T10:00:00.000Z',
    number: 12345
  },
  {
    _id: '64e3e7dbc5b9c1001c6e6c9f',
    ingredients: ['643d69a5c3f7b9001cfa093c'],
    status: 'pending',
    name: 'Бургер с соусом',
    createdAt: '2023-08-22T11:00:00.000Z',
    updatedAt: '2023-08-22T11:00:00.000Z',
    number: 12346
  }
];

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

describe('ordersSlice async actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOrders', () => {
    it('should handle pending state', () => {
      const action = { type: fetchOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

      const action = {
        type: fetchOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('should set default error message when error message is missing', () => {
      const action = {
        type: fetchOrders.rejected.type,
        error: {}
      };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказов');
    });
  });
});



