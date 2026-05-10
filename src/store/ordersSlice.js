import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiErrorToObject,
  createOrderRequest,
  fetchOrderRequest,
} from '../api/client';

const ORDERS_STORAGE_KEY = 'svetomir_recent_orders';

export function loadRecentOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders.slice(0, 10)));
  } catch {
    // Storage is optional for the app flow.
  }
}

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ body, meta }, { rejectWithValue }) => {
    try {
      return await createOrderRequest(body, meta);
    } catch (error) {
      return rejectWithValue(apiErrorToObject(error));
    }
  },
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      return await fetchOrderRequest(orderNumber);
    } catch (error) {
      return rejectWithValue(apiErrorToObject(error));
    }
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    currentOrder: null,
    recentOrders: loadRecentOrders(),
    createStatus: 'idle',
    lookupStatus: 'idle',
    error: null,
  },
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.currentOrder = action.payload;
        state.recentOrders = [
          action.payload,
          ...state.recentOrders.filter((order) => order.number !== action.payload.number),
        ].slice(0, 10);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || { message: action.error.message };
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.lookupStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.lookupStatus = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.lookupStatus = 'failed';
        state.error = action.payload || { message: action.error.message };
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;

export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectRecentOrders = (state) => state.orders.recentOrders;
export const selectOrderCreateStatus = (state) => state.orders.createStatus;
export const selectOrderError = (state) => state.orders.error;

export default ordersSlice.reducer;
