import orderReducer, {
  fetchOrderByNumber,
  clearOrder,
  initialState
} from '../orderSlice';
import { TOrder } from '@utils-types';
import * as burgerApi from '@api';

const mockOrder: TOrder = {
  _id: '64e3e7dbc5b9c1001c6e6c9e',
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
  status: 'done',
  name: 'Краторный space бургер',
  createdAt: '2023-08-22T10:00:00.000Z',
  updatedAt: '2023-08-22T10:00:00.000Z',
  number: 12345
};

jest.mock('@api', () => ({
  getOrderByNumberApi: jest.fn()
}));

describe('orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOrderByNumber async actions', () => {
    it('should handle pending state', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.getOrderByNumberApi as jest.Mock).mockResolvedValue({
        success: true,
        orders: [mockOrder]
      });

      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Заказ не найден';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.order).toBeNull();
    });

    it('should set default error message when error message is missing', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: {}
      };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказа');
    });
  });

  describe('clearOrder', () => {
    it('should clear order', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.order).toBeNull();
    });
  });
});

