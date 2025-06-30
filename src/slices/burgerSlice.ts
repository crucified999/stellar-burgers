import {
  getIngredientsApi,
  getFeedsApi,
  orderBurgerApi,
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi,
  getUserApi,
  getOrdersApi,
  updateUserApi
} from '@api';
import { TIngredient, TConstructorItems, TOrder } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { create } from 'domain';

interface IBurgerState {
  ingredients: TIngredient[];
  constructorItems: TConstructorItems;
  isLoading: boolean;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orders: TOrder[];
  userOrders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  isAuthorized: boolean;
  name: string;
  email: string;
  error?: string;
}

const initialState: IBurgerState = {
  ingredients: [],
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  orderModalData: null,
  orderRequest: false,
  orders: [],
  userOrders: [],
  totalOrders: 0,
  ordersToday: 0,
  isAuthorized: false,
  name: '',
  email: '',
  error: ''
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/all',
  async () => await getIngredientsApi()
);

export const fetchFeeds = createAsyncThunk(
  'user/feeds',
  async () => await getFeedsApi()
);

export const fetchOrderBurger = createAsyncThunk(
  'orders/newOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const fetchUserOrders = createAsyncThunk(
  'user/orders',
  async () => await getOrdersApi()
);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  async (data: TRegisterData) => await updateUserApi(data)
);

export const fetchLogoutUser = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const getUserThunk = createAsyncThunk(
  'user/get',
  async () => await getUserApi()
);

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngedient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: v4()
        });
      }
    },

    closeModalRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
      })
      .addCase(fetchOrderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthorized = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
        state.isAuthorized = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.name = '';
        state.email = '';
        state.error = action.error.message;
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
        state.isAuthorized = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLogoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.email = '';
        state.name = '';
        state.isAuthorized = false;
      })
      .addCase(fetchLogoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.user.name;
        state.email = action.payload.user.email;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },

  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrders: (state) => state.orders,
    selectUserOrders: (state) => state.userOrders,
    selectTotalOrders: (state) => state.totalOrders,
    selectOrdersToday: (state) => state.ordersToday,
    selectIsAuthorized: (state) => state.isAuthorized,
    selectUserName: (state) => state.name,
    selectUserEmail: (state) => state.email
  }
});

export const {
  selectIngredients,
  selectIsLoading,
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectUserOrders,
  selectTotalOrders,
  selectOrdersToday,
  selectIsAuthorized,
  selectUserName,
  selectUserEmail
} = burgerSlice.selectors;

export const { addIngedient, closeModalRequest } = burgerSlice.actions;
export default burgerSlice.reducer;
