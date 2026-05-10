import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { saveCartItems } from './cartSlice';
import ordersReducer, { saveRecentOrders } from './ordersSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

let previousCartItems = store.getState().cart.items;
let previousRecentOrders = store.getState().orders.recentOrders;

store.subscribe(() => {
  const state = store.getState();

  if (state.cart.items !== previousCartItems) {
    previousCartItems = state.cart.items;
    saveCartItems(state.cart.items);
  }

  if (state.orders.recentOrders !== previousRecentOrders) {
    previousRecentOrders = state.orders.recentOrders;
    saveRecentOrders(state.orders.recentOrders);
  }
});
