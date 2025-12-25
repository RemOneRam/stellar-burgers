import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectFeeds = (state: RootState) => state.feeds.data;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;

export const selectOrders = (state: RootState) => state.orders.items;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;

export const selectUserLoading = (state: RootState) => state.user.isLoading;

export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;

const selectConstructorState = (state: RootState) => state.burgerConstructor;

export const selectConstructorItems = createSelector(
  [selectConstructorState],
  (constructor) => ({
    bun: constructor?.bun ?? null,
    ingredients: constructor?.ingredients ?? []
  })
);

export const selectOrderRequest = (state: RootState) =>
  state.orderModal.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orderModal.orderModalData;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
