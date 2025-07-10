import * as orderFixture from '../fixtures/orders.json';

const HOME_PAGE = 'http://localhost:4000';

describe('E2E тест для конструктора бургера', () => {

  beforeEach(() => {
    // Перехват запросов на получение ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    cy.visit(HOME_PAGE);
  });


  it('Список ингредиентов доступен для выбора', () => {
    cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"], [data-ingredient="sauce"]').should(
      'have.length.at.least',
      1
    );
  });

  describe('Проверка работы модальных окон ингредиентов', () => {
    beforeEach(() => {
      cy.get('[data-ingredient="bun"]:first-of-type').click();
    })

    describe('Проверка открытрия модального окна ингредиента', () => {
      it('Модальное окно остается открытым при перезагрузке страницы', () => {
        cy.reload(true);
        cy.get('#modals').children().should('have.length', 2);
      });
    });

    describe('Проверка закрытия модального окна ингредиента', () => {
      it('Закрытие модального окна на кнопку крестика', () => {
        cy.get('#modals').find('[type="button"]').click();
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие модального окна нажатием на overlay', () => {
        cy.get('#modals>div:nth-child(2)').click({ force: true });
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие модального окна нажатием на Esc', () => {
        cy.get('body').type('{esc}');
        cy.get('#modals').children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {

    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'orders' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit(HOME_PAGE);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('Авторизованный пользователь может оформить заказ', () => {
      cy.get('[data-ingredient="bun"]:first-of-type button').click();
      cy.get('[data-ingredient="main"]:first-of-type button').click();
      cy.get('[data-ingredient="sauce"]:first-of-type button').click();

      cy.get('[data-testid="burger-constructor"] [data-testid="top-bun"]').children().should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] [data-testid="bottom-bun"]').children().should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] ul:first-of-type').children().should('have.length', 2);

      cy.get('[data-testid="order-button"]').click();

      cy.get('#modals').children().should('exist');
      cy.get('body').type('{esc}');

      cy.get('[data-testid="burger-constructor"] [data-testid="top-bun"]').should('not.exist');
      cy.get('[data-testid="burger-constructor"] [data-testid="bottom-bun"]').should('not.exist');
      cy.get('[data-testid="burger-constructor"] ul:first-of-type [data-testid="main-ingredient"]').should('not.exist');
    });
  });
});

