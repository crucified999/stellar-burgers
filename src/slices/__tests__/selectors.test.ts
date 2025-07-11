import { burgerSlice } from '../burgerSlice';
import { mockBun, mockMain, mockConstructorIngredient } from '../mockData';

describe('Селекторы burgerSlice', () => {
  it('Должны правильно экспортироваться', () => {
    expect(burgerSlice.selectors).toBeDefined();
    expect(burgerSlice.selectors.selectIngredients).toBeDefined();
    expect(burgerSlice.selectors.selectIsLoading).toBeDefined();
    expect(burgerSlice.selectors.selectConstructorItems).toBeDefined();
    expect(burgerSlice.selectors.selectOrderModalData).toBeDefined();
    expect(burgerSlice.selectors.selectOrderRequest).toBeDefined();
    expect(burgerSlice.selectors.selectOrders).toBeDefined();
    expect(burgerSlice.selectors.selectUserOrders).toBeDefined();
    expect(burgerSlice.selectors.selectTotalOrders).toBeDefined();
    expect(burgerSlice.selectors.selectOrdersToday).toBeDefined();
    expect(burgerSlice.selectors.selectIsAuthorized).toBeDefined();
    expect(burgerSlice.selectors.selectUserName).toBeDefined();
    expect(burgerSlice.selectors.selectUserEmail).toBeDefined();
  });

  it('Должны правильно работать с состоянием', () => {
    const testState = {
      burger: {
        ingredients: [mockBun, mockMain],
        constructorItems: {
          bun: mockBun,
          ingredients: [mockConstructorIngredient]
        },
        isLoading: true,
        orderModalData: null,
        orderRequest: false,
        orders: [],
        userOrders: [],
        totalOrders: 100,
        ordersToday: 10,
        isAuthorized: true,
        name: 'Иван',
        email: 'ivan@example.com',
        error: ''
      }
    };

    expect(burgerSlice.selectors.selectIngredients(testState)).toEqual([
      mockBun,
      mockMain
    ]);

    expect(burgerSlice.selectors.selectIsLoading(testState)).toBe(true);
    expect(burgerSlice.selectors.selectConstructorItems(testState)).toEqual({
      bun: mockBun,
      ingredients: [mockConstructorIngredient]
    });

    expect(burgerSlice.selectors.selectOrderModalData(testState)).toBeNull();
    expect(burgerSlice.selectors.selectOrderRequest(testState)).toBe(false);
    expect(burgerSlice.selectors.selectOrders(testState)).toEqual([]);
    expect(burgerSlice.selectors.selectUserOrders(testState)).toEqual([]);
    expect(burgerSlice.selectors.selectTotalOrders(testState)).toBe(100);
    expect(burgerSlice.selectors.selectOrdersToday(testState)).toBe(10);
    expect(burgerSlice.selectors.selectIsAuthorized(testState)).toBe(true);
    expect(burgerSlice.selectors.selectUserName(testState)).toBe('Иван');
    expect(burgerSlice.selectors.selectUserEmail(testState)).toBe(
      'ivan@example.com'
    );
  });
});
