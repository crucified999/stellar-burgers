import { burgerSlice, IBurgerState } from '../burgerSlice';
import { mockBun, mockMain, mockSauce, mockConstructorIngredient } from '../mockData';

describe('Редьюсеры burgerSlice', () => {
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

  describe('addIngedient', () => {

    it('Добавление булки в конструктор', () => {

      const action = { type: 'burger/addIngedient', payload: mockBun };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.constructorItems.bun).toEqual(mockBun);
      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });

    it('Добавление ингредиента в список начинки', () => {

      const action = { type: 'burger/addIngedient', payload: mockMain };
      const newState = burgerSlice.reducer(initialState, action);

      expect(newState.constructorItems.bun).toBeNull();
      expect(newState.constructorItems.ingredients).toHaveLength(1);
      expect(newState.constructorItems.ingredients[0]).toMatchObject({
        ...mockMain,
        id: expect.any(String)
      });
    });

    it('Замена булки при добавлении новой булки', () => {

      const stateWithBun = {
        ...initialState,
        constructorItems: {
          bun: mockBun,
          ingredients: []
        }
      };

      const newBun = { ...mockBun, _id: 'bun-2', name: 'Новая булка' };
      const action = { type: 'burger/addIngedient', payload: newBun };
      const newState = burgerSlice.reducer(stateWithBun, action);

      expect(newState.constructorItems.bun).toEqual(newBun);
    });
  });

  describe('removeIngredient', () => {

    it('Удалить ингредиент по индексу', () => {
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            mockConstructorIngredient,
            { ...mockSauce, id: '643d69a5c3f7b9001cfa0942' }
          ]
        }
      };

      const action = { type: 'burger/removeIngredient', payload: { index: 0 } };
      const newState = burgerSlice.reducer(stateWithIngredients, action);

      expect(newState.constructorItems.ingredients).toHaveLength(1);
      expect(newState.constructorItems.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0942'
      );
    });
  });

  describe('moveIngredientUp', () => {

    it('Перемещение ингредиента вверх', () => {

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockMain, id: '643d69a5c3f7b9001cfa0941' },
            { ...mockSauce, id: '643d69a5c3f7b9001cfa0942' }
          ]
        }
      };

      const action = {
        type: 'burger/moveIngredientUp',
        payload: { ...mockSauce, id: '643d69a5c3f7b9001cfa0942' }
      };

      const newState = burgerSlice.reducer(stateWithIngredients, action);

      expect(newState.constructorItems.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0942'
      );

      expect(newState.constructorItems.ingredients[1]._id).toBe(
        '643d69a5c3f7b9001cfa0941'
      );
    });
  });

  describe('moveIngredientDown', () => {

    it('Перемещение ингредиента вниз', () => {

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockMain, id: '643d69a5c3f7b9001cfa0941' },
            { ...mockSauce, id: '643d69a5c3f7b9001cfa0942' }
          ]
        }
      };

      const action = {
        type: 'burger/moveIngredientDown',
        payload: { ...mockMain, id: '643d69a5c3f7b9001cfa0941' }
      };

      const newState = burgerSlice.reducer(stateWithIngredients, action);

      expect(newState.constructorItems.ingredients[0]._id).toBe(
        '643d69a5c3f7b9001cfa0942'
      );

      expect(newState.constructorItems.ingredients[1]._id).toBe(
        '643d69a5c3f7b9001cfa0941'
      );
    });
  });

  describe('closeModalRequest', () => {

    it('Сброс состояния модального окна заказа', () => {

      const stateWithOrder = {
        ...initialState,
        orderRequest: true,
        orderModalData: {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 1,
          ingredients: []
        },
        constructorItems: {
          bun: mockBun,
          ingredients: [mockConstructorIngredient]
        }
      };

      const action = { type: 'burger/closeModalRequest' };
      const newState = burgerSlice.reducer(stateWithOrder, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toBeNull();
      expect(newState.constructorItems).toEqual({ bun: null, ingredients: [] });
    });
  });

  describe('resetOrderModalData', () => {

    it('Сброс данных модального окна заказа', () => {

      const stateWithOrder = {
        ...initialState,
        orderModalData: {
          _id: '1',
          status: 'done',
          name: 'Заказ 1',
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
          number: 1,
          ingredients: []
        }
      };

      const action = { type: 'burger/resetOrderModalData' };
      const newState = burgerSlice.reducer(stateWithOrder, action);
      
      expect(newState.orderModalData).toBeNull();
    });
  });
});
