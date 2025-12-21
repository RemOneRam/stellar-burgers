import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('should return initial state when called with undefined state and unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state.feeds).toEqual({
      data: null,
      isLoading: false,
      error: null
    });
    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
    expect(state.orders).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
    expect(state.user).toEqual({
      user: null,
      isLoading: false,
      error: null
    });
    expect(state.order).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
    expect(state.orderModal).toEqual({
      orderRequest: false,
      orderModalData: null
    });
    expect(state.auth).toMatchObject({
      user: null,
      isLoading: false,
      error: null
    });
  });
});

