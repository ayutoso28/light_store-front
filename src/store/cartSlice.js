import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'svetomir_cart_v2';
const LEGACY_CART_STORAGE_KEY = 'svetomir_cart';

export function loadCartItems() {
  try {
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage is optional for the app flow.
  }
}

function clampQuantity(product, quantity) {
  const requested = Math.max(1, Number(quantity) || 1);
  if (product.stockQuantity > 0) {
    return Math.min(requested, product.stockQuantity);
  }
  return requested;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartItems(),
  },
  reducers: {
    addToCart: {
      reducer(state, action) {
        const { product, quantity } = action.payload;
        const existing = state.items.find((item) => item.product.id === product.id);

        if (existing) {
          existing.quantity = clampQuantity(
            product,
            existing.quantity + quantity,
          );
          existing.product = product;
          return;
        }

        state.items.push({
          product,
          quantity: clampQuantity(product, quantity),
        });
      },
      prepare(product, quantity = 1) {
        return { payload: { product, quantity } };
      },
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
        return;
      }

      const item = state.items.find((cartItem) => cartItem.product.id === productId);
      if (item) {
        item.quantity = clampQuantity(item.product, quantity);
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

export default cartSlice.reducer;
