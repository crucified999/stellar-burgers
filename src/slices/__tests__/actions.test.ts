import { burgerSlice, IBurgerState } from '../burgerSlice';
import { mockBun, mockMain, mockSauce } from '../mockData';

describe('Экшены (extraReducers, async actions) burgerSlice', () => {
  let initialState: IBurgerState;

  beforeEach(() => {
    initialState = {
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
  });

  describe('fetchIngredients', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'ingredients/all/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение данных при fulfilled', () => {
      const ingredients = [mockBun, mockMain, mockSauce];
      const action = {
        type: 'ingredients/all/fulfilled',
        payload: ingredients
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.ingredients).toEqual(ingredients);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: 'ingredients/all/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchFeeds', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/feeds/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });
    it('Установка isLoading в false и сохранение данных при fulfilled', () => {
      const feedsData = {
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Заказ 1',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            number: 1,
            ingredients: []
          }
        ],
        total: 100,
        totalToday: 10
      };

      const action = { type: 'user/feeds/fulfilled', payload: feedsData };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.orders).toEqual(feedsData.orders);
      expect(newState.totalOrders).toBe(feedsData.total);
      expect(newState.ordersToday).toBe(feedsData.totalToday);
    });
    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = {
        type: 'user/feeds/rejected',
        error: { message: errorMessage }
      };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderBurger', () => {
    it('Установка orderRequest в true при pending', () => {
      const action = { type: 'orders/newOrder/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(true);
    });

    it('Сохранение данных заказа при fulfilled', () => {
      const orderData = {
        order: {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 1,
          ingredients: []
        }
      };

      const action = { type: 'orders/newOrder/fulfilled', payload: orderData };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.orderModalData).toEqual(orderData.order);
    });

    it('Установка orderRequest в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: 'orders/newOrder/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchLoginUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/login/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });
    it('Установка isLoading в false и сохранение данных пользователя при fulfilled', () => {
      const userData = {
        user: { name: 'Иван', email: 'ivan@example.com' }
      };

      const action = { type: 'user/login/fulfilled', payload: userData };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe(userData.user.name);
      expect(newState.email).toBe(userData.user.email);
      expect(newState.isAuthorized).toBe(true);
    });
    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: 'user/login/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchRegisterUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/register/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });
    it('Установка isLoading в false и isAuthorized в true при fulfilled', () => {
      const action = { type: 'user/register/fulfilled' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.isAuthorized).toBe(true);
    });
    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: 'user/register/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('getUserThunk', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/get/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение данных пользователя при fulfilled', () => {
      const userData = {
        user: { name: 'Иван', email: 'ivan@example.com' }
      };

      const action = { type: 'user/get/fulfilled', payload: userData };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe(userData.user.name);
      expect(newState.email).toBe(userData.user.email);
      expect(newState.isAuthorized).toBe(true);
    });

    it('Установка isLoading в false и сброс данных пользователя при rejected', () => {
      const errorMessage = 'Ошибка получения пользователя';
      const stateWithUser = {
        ...initialState,
        name: 'Иван',
        email: 'ivan@example.com',
        isAuthorized: true
      };

      const action = {
        type: 'user/get/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(stateWithUser, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe('');
      expect(newState.email).toBe('');
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchLogoutUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/logout/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сброс данных пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        name: 'Иван',
        email: 'ivan@example.com',
        isAuthorized: true
      };

      const action = { type: 'user/logout/fulfilled' };
      const newState = burgerSlice.reducer(stateWithUser, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe('');
      expect(newState.email).toBe('');
      expect(newState.isAuthorized).toBe(false);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: 'user/logout/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchUserOrders', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/orders/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение заказов пользователя при fulfilled', () => {
      const userOrders = [
        {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 1,
          ingredients: []
        }
      ];

      const action = { type: 'user/orders/fulfilled', payload: userOrders };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.userOrders).toEqual(userOrders);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов пользователя';
      const action = {
        type: 'user/orders/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchUpdateUser', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'user/update/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и обновление данных пользователя при fulfilled', () => {
      const userData = {
        user: { name: 'Новый Иван', email: 'newivan@example.com' }
      };

      const action = { type: 'user/update/fulfilled', payload: userData };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.name).toBe(userData.user.name);
      expect(newState.email).toBe(userData.user.email);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка обновления пользователя';
      const action = {
        type: 'user/update/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('Установка isLoading в true при pending', () => {
      const action = { type: 'order/orderByNumber/pending' };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
    });

    it('Установка isLoading в false и сохранение заказа при fulfilled', () => {
      const orderData = {
        _id: '1',
        status: 'done',
        name: 'Заказ 1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        number: 1,
        ingredients: []
      };

      const action = {
        type: 'order/orderByNumber/fulfilled',
        payload: orderData
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.orderModalData).toEqual(orderData);
    });

    it('Установка isLoading в false и сохранение ошибки при rejected', () => {
      const errorMessage = 'Ошибка получения заказа';
      const action = {
        type: 'order/orderByNumber/rejected',
        error: { message: errorMessage }
      };

      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
