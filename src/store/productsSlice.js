import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiErrorToObject,
  fetchCategoriesRequest,
  fetchProductRequest,
  fetchProductsRequest,
} from '../api/client';

const initialState = {
  items: [],
  featured: [],
  categories: [],
  currentProduct: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    total_pages: 1,
  },
  status: 'idle',
  featuredStatus: 'idle',
  categoriesStatus: 'idle',
  detailStatus: 'idle',
  error: null,
  featuredError: null,
  categoriesError: null,
  detailError: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchProductsRequest(params);
    } catch (error) {
      return rejectWithValue(apiErrorToObject(error));
    }
  },
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsRequest({ limit: 6, sort: 'popular' });
    } catch (error) {
      return rejectWithValue(apiErrorToObject(error));
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesRequest();
    } catch (error) {
      return rejectWithValue(apiErrorToObject(error));
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductRequest(id);
    } catch (error) {
      return rejectWithValue(apiErrorToObject(error));
    }
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || { message: action.error.message };
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredStatus = 'loading';
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredStatus = 'succeeded';
        state.featured = action.payload.data;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredStatus = 'failed';
        state.featuredError = action.payload || { message: action.error.message };
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload || { message: action.error.message };
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload || { message: action.error.message };
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectFeaturedProducts = (state) => state.products.featured;
export const selectCategories = (state) => state.products.categories;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsStatus = (state) => state.products.status;
export const selectFeaturedStatus = (state) => state.products.featuredStatus;
export const selectCategoriesStatus = (state) => state.products.categoriesStatus;
export const selectProductDetailStatus = (state) => state.products.detailStatus;
export const selectProductsError = (state) => state.products.error;
export const selectFeaturedError = (state) => state.products.featuredError;
export const selectCategoriesError = (state) => state.products.categoriesError;
export const selectProductDetailError = (state) => state.products.detailError;

export default productsSlice.reducer;
