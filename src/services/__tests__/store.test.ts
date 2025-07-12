import store, { RootState } from '../store';
import { burgerSlice } from '../../slices/burgerSlice';

describe('Store', () => {
  describe('rootReducer', () => {
    it('должен правильно инициализировать rootReducer', () => {
      const state = store.getState();

      expect(state).toHaveProperty('burger');
      expect(state.burger).toHaveProperty('ingredients');
      expect(state.burger).toHaveProperty('constructorItems');
      expect(state.burger).toHaveProperty('isLoading');
      expect(state.burger).toHaveProperty('orderModalData');
      expect(state.burger).toHaveProperty('orderRequest');
      expect(state.burger).toHaveProperty('orders');
      expect(state.burger).toHaveProperty('userOrders');
      expect(state.burger).toHaveProperty('totalOrders');
      expect(state.burger).toHaveProperty('ordersToday');
      expect(state.burger).toHaveProperty('isAuthorized');
      expect(state.burger).toHaveProperty('name');
      expect(state.burger).toHaveProperty('email');
      expect(state.burger).toHaveProperty('error');
    });

    it('должен иметь правильные начальные значения', () => {
      const state = store.getState();

      expect(state.burger.ingredients).toEqual([]);
      expect(state.burger.constructorItems).toEqual({
        bun: null,
        ingredients: []
      });
      expect(state.burger.isLoading).toBe(false);
      expect(state.burger.orderModalData).toBeNull();
      expect(state.burger.orderRequest).toBe(false);
      expect(state.burger.orders).toEqual([]);
      expect(state.burger.userOrders).toEqual([]);
      expect(state.burger.totalOrders).toBe(0);
      expect(state.burger.ordersToday).toBe(0);
      expect(state.burger.isAuthorized).toBe(false);
      expect(state.burger.name).toBe('');
      expect(state.burger.email).toBe('');
      expect(state.burger.error).toBe('');
    });

    it('должен обрабатывать экшены burgerSlice', () => {
      const mockIngredient = {
        _id: 'test-1',
        name: 'Тестовый ингредиент',
        type: 'main',
        proteins: 10,
        fat: 5,
        carbohydrates: 15,
        calories: 100,
        price: 50,
        image: 'test.png',
        image_large: 'test-large.png',
        image_mobile: 'test-mobile.png'
      };

      store.dispatch(burgerSlice.actions.addIngedient(mockIngredient));

      const newState = store.getState();

      expect(newState.burger.constructorItems.ingredients).toHaveLength(1);
      expect(newState.burger.constructorItems.ingredients[0]).toMatchObject({
        ...mockIngredient,
        id: expect.any(String)
      });
    });
  });

  describe('Редьюсер не мутирует состояние', () => {
    it('должен возвращать то же состояние при неизвестном экшене', () => {
      const initialState = burgerSlice.getInitialState();
      const unknownAction = { type: 'UNKNOWN_ACTION' };

      const newState = burgerSlice.reducer(initialState, unknownAction as any);

      expect(newState).toEqual(initialState);
    });

    it('должен возвращать то же состояние при пустом экшене', () => {
      const initialState = burgerSlice.getInitialState();
      const emptyAction = { type: '' };

      const newState = burgerSlice.reducer(initialState, emptyAction as any);

      expect(newState).toEqual(initialState);
    });

    it('должен возвращать то же состояние при экшене без type', () => {
      const initialState = burgerSlice.getInitialState();
      const actionWithoutType = { payload: 'test' };

      const newState = burgerSlice.reducer(
        initialState,
        actionWithoutType as any
      );

      expect(newState).toEqual(initialState);
    });
  });

  describe('Типы', () => {
    it('должен иметь правильный тип RootState', () => {
      const state: RootState = store.getState();

      expect(typeof state.burger.ingredients).toBe('object');
      expect(Array.isArray(state.burger.ingredients)).toBe(true);
    });
  });
});
