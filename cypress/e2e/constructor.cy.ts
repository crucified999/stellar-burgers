import * as orderFixture from '../fixtures/orders.json';

describe('E2E тест для конструктора бургера', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
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
      cy.get('[data-ingredient="bun"]').first().as('firstBun');
      cy.get('@firstBun').click();
      cy.get('#modals').as('modal');
    });

    describe('Проверка открытрия модального окна ингредиента', () => {
      it('Модальное окно остается открытым при перезагрузке страницы', () => {
        cy.reload(true);
        cy.get('@modal').children().should('have.length', 2);
      });

      it('Модальное окно открывается у нужного ингредиента', () => {
        cy.fixture('ingredients').then((ingredientsData) => {
          const bunIngredient = ingredientsData.data.find(
            (ingredient: { type: string }) => ingredient.type === 'bun'
          );
          cy.get('@modal')
            .find('[data-testid="ingredient-name"]')
            .should('contain', bunIngredient.name);
        });
      });
    });

    describe('Проверка закрытия модального окна ингредиента', () => {
      it('Закрытие модального окна на кнопку крестика', () => {
        cy.get('@modal').find('[type="button"]').click();
        cy.get('@modal').children().should('have.length', 0);
      });

      it('Закрытие модального окна нажатием на overlay', () => {
        cy.get('@modal').find('div:nth-child(2)').click({ force: true, multiple: true });
        cy.get('@modal').children().should('have.length', 0);
      });

      it('Закрытие модального окна нажатием на Esc', () => {
        cy.get('body').type('{esc}');
        cy.get('@modal').children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'orders' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
      cy.visit('/');
      cy.get('[data-ingredient="bun"]:first-of-type button')
        .as('bunBtn')
        .click();
      cy.get('[data-ingredient="main"]:first-of-type button')
        .as('mainBtn')
        .click();
      cy.get('[data-ingredient="sauce"]:first-of-type button')
        .as('sauceBtn')
        .click();
      cy.get('[data-testid="burger-constructor"] [data-testid="top-bun"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] [data-testid="bottom-bun"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] ul:first-of-type')
        .children()
        .should('have.length', 2);
      cy.get('[data-testid="order-button"]').as('orderBtn').click();
      cy.get('#modals').as('modal');
    });

    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('Авторизованный пользователь может оформить заказ', () => {
      cy.get('@modal').children().should('exist');
      cy.get('body').type('{esc}');
      cy.get(
        '[data-testid="burger-constructor"] [data-testid="top-bun"]'
      ).should('not.exist');
      cy.get(
        '[data-testid="burger-constructor"] [data-testid="bottom-bun"]'
      ).should('not.exist');
      cy.get(
        '[data-testid="burger-constructor"] ul:first-of-type [data-testid="main-ingredient"]'
      ).should('not.exist');
    });

    it('В модальном окне отображается корректный номер заказа', () => {
      cy.fixture('orders').then((data) => {
        const order = data.order.number;
        cy.get('@modal').should('contain', order);
      });
    });
  });
});
