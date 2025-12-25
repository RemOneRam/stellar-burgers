import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';

export interface OrderState {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders && response.orders.length > 0) {
      return response.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
