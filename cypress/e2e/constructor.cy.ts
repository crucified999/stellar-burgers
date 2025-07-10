import * as orderFixture from '../fixtures/orders.json';

describe('E2E тест для конструктора бургера', () => {

  beforeEach(() => {
    // Перехват запросов на получение ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    cy.visit('http://localhost:4000');
  });


  it('Список ингредиентов доступен для выбора', () => {
    cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"],[data-ingredient="sauce"]').should(
      'have.length.at.least',
      1
    );
  });
  

});