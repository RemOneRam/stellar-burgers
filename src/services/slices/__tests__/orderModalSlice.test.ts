import orderModalReducer, {
  createOrder,
  clearOrderModal,
  OrderModalState,
  initialState
} from '../orderModalSlice';
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
  orderBurgerApi: jest.fn()
}));

describe('orderModalSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder async actions', () => {
    it('should handle pending state', () => {
      const action = { type: createOrder.pending.type };
      const state = orderModalReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
    });

    it('should handle fulfilled state', () => {
      (burgerApi.orderBurgerApi as jest.Mock).mockResolvedValue({
        success: true,
        order: mockOrder
      });

      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderModalReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('should handle rejected state', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      };
      const state = orderModalReducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('clearOrderModal', () => {
    it('should clear order modal data', () => {
      const stateWithOrder = {
        orderRequest: false,
        orderModalData: mockOrder
      };
      const action = clearOrderModal();
      const state = orderModalReducer(stateWithOrder, action);

      expect(state.orderModalData).toBeNull();
      expect(state.orderRequest).toBe(false);
    });
  });
});


