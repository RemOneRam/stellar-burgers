const BURGER_CONSTRUCTOR_SELECTOR = '[class*="burger_constructor"]';
const MODAL_SELECTOR = '[class*="modal"]';
const MODAL_OVERLAY_SELECTOR = '[class*="modal_overlay"]';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Adding ingredients to constructor', () => {
    it('should add ingredient from list to constructor', () => {
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(BURGER_CONSTRUCTOR_SELECTOR).should('contain', 'Биокотлета из марсианской Магнолии');
    });

    it('should add bun to constructor', () => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.get(BURGER_CONSTRUCTOR_SELECTOR).should('contain', 'Краторная булка N-200i');
    });
  });

  describe('Ingredient details modal', () => {
    it('should open modal with ingredient details on click', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();

      cy.get(MODAL_SELECTOR).should('be.visible');
      cy.get(MODAL_SELECTOR).should('contain', 'Биокотлета из марсианской Магнолии');
      cy.get(MODAL_SELECTOR).should('contain', 'Калории, ккал');
      cy.get(MODAL_SELECTOR).should('contain', 'Белки, г');
      cy.get(MODAL_SELECTOR).should('contain', 'Жиры, г');
      cy.get(MODAL_SELECTOR).should('contain', 'Углеводы, г');
    });

    it('should display correct ingredient data in modal', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();

      cy.get(MODAL_SELECTOR).should('contain', 'Биокотлета из марсианской Магнолии');
      cy.get(MODAL_SELECTOR).should('contain', '424');
      cy.get(MODAL_SELECTOR).should('contain', '420');
      cy.get(MODAL_SELECTOR).should('contain', '142');
      cy.get(MODAL_SELECTOR).should('contain', '242');
    });

    it('should close modal on close button click', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();

      cy.get(MODAL_SELECTOR).should('be.visible');
      cy.get(MODAL_SELECTOR).find('button').first().click();
      cy.get(MODAL_SELECTOR).should('not.exist');
    });

    it('should close modal on overlay click', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();

      cy.get(MODAL_SELECTOR).should('be.visible');
      cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });
      cy.url().should('eq', 'http://localhost:4000/');
    });
  });

  describe('Order creation process', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.document.cookie = 'accessToken=fake-access-token; path=/';
      });

      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    });

    it('should create order with ingredients and display order number', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get(MODAL_SELECTOR).should('be.visible');
      cy.get(MODAL_SELECTOR).should('contain', '12345');
    });

    it('should clear constructor after successful order', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get(MODAL_SELECTOR).should('be.visible');
      cy.get(MODAL_SELECTOR).find('button').first().click();

      cy.get(BURGER_CONSTRUCTOR_SELECTOR).should('contain', 'Выберите булки');
      cy.get(BURGER_CONSTRUCTOR_SELECTOR).should('contain', 'Выберите начинку');
    });

    it('should redirect to login if not authenticated', () => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });

      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Оформить заказ').click();

      cy.url().should('include', '/login');
    });
  });
});

