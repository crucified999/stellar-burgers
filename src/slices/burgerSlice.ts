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
  updateUserApi,
  getOrderByNumberApi
} from '@api';
import {
  TIngredient,
  TConstructorItems,
  TOrder,
  TConstructorIngredient
} from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

export interface IBurgerState {
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
  getIngredientsApi
);

export const fetchFeeds = createAsyncThunk('user/feeds', getFeedsApi);

export const fetchOrderBurger = createAsyncThunk(
  'orders/newOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/orderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    return response.orders[0];
  }
);

export const fetchUserOrders = createAsyncThunk('user/orders', getOrdersApi);

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

export const fetchLogoutUser = createAsyncThunk('user/logout', logoutApi);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

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

    removeIngredient(state, action: PayloadAction<{ index: number }>) {
      state.constructorItems.ingredients.splice(action.payload.index, 1);
    },

    closeModalRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },

    resetOrderModalData(state) {
      state.orderModalData = null;
    },

    moveIngredientUp(state, action: PayloadAction<TConstructorIngredient>) {
      const currentIngredientIndex =
        state.constructorItems.ingredients.findIndex(
          (item) => item._id === action.payload._id
        );
      const hihgerIngredient =
        state.constructorItems.ingredients[currentIngredientIndex - 1];

      state.constructorItems.ingredients.splice(
        currentIngredientIndex - 1,
        2,
        action.payload,
        hihgerIngredient
      );
    },

    moveIngredientDown(state, action: PayloadAction<TConstructorIngredient>) {
      const currentIngredientIndex =
        state.constructorItems.ingredients.findIndex(
          (item) => item._id === action.payload._id
        );

      const lowerIngredient =
        state.constructorItems.ingredients[currentIngredientIndex + 1];

      state.constructorItems.ingredients.splice(
        currentIngredientIndex,
        2,
        lowerIngredient,
        action.payload
      );
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
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
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

export const {
  addIngedient,
  removeIngredient,
  closeModalRequest,
  moveIngredientUp,
  moveIngredientDown,
  resetOrderModalData
} = burgerSlice.actions;
export default burgerSlice.reducer;
