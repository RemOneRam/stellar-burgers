import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

export interface OrdersState {
  items: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrdersState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export default ordersSlice.reducer;
