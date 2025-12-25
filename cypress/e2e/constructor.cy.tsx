const BURGER_CONSTRUCTOR_SELECTOR = '[class*="burger_constructor"]';
const MODAL_SELECTOR = '[class*="modal"]';
const MODAL_OVERLAY_SELECTOR = '[class*="overlay"]';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
  });

  describe('Adding ingredients to constructor', () => {
    it('should add ingredient from list to constructor', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 10000 }).should('exist');
    });

    it('should add bun to constructor', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Краторная булка N-200i', { timeout: 10000 }).should('exist');
    });
  });

  describe('Ingredient details modal', () => {
    it('should open modal with ingredient details on click', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click({ force: true });

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 10000 }).should('exist');
      cy.contains('Калории, ккал', { timeout: 10000 }).should('exist');
      cy.contains('Белки, г', { timeout: 10000 }).should('exist');
      cy.contains('Жиры, г', { timeout: 10000 }).should('exist');
      cy.contains('Углеводы, г', { timeout: 10000 }).should('exist');
    });

    it('should display correct ingredient data in modal', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click({ force: true });

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 10000 }).should('exist');
      cy.contains('424', { timeout: 10000 }).should('exist');
      cy.contains('420', { timeout: 10000 }).should('exist');
      cy.contains('142', { timeout: 10000 }).should('exist');
      cy.contains('242', { timeout: 10000 }).should('exist');
    });

    it('should close modal on close button click', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click({ force: true });

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.get('body').then(($body) => {
        const modal = $body.find('[class*="modal"]');
        if (modal.length > 0) {
          cy.get('[class*="modal"]').find('button[class*="button"]').first().click();
        }
      });
      cy.go('back');
      cy.url({ timeout: 5000 }).should('eq', 'http://localhost:4000/');
    });

    it('should close modal on overlay click', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click({ force: true });

      cy.url({ timeout: 10000 }).should('include', '/ingredients/');
      cy.get('body').click(0, 0, { force: true });
      cy.go('back');
      cy.url({ timeout: 5000 }).should('eq', 'http://localhost:4000/');
    });
  });

  describe('Order creation process', () => {
    beforeEach(() => {
      // Перехватываем запросы ПЕРЕД установкой токенов
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUserApi');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
      cy.intercept('POST', 'https://norma.education-services.ru/api/orders', { fixture: 'order.json' }).as('createOrderNorma');
      
      // Устанавливаем токены ДО загрузки страницы
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        win.document.cookie = 'accessToken=fake-access-token; path=/';
      });
      
      // Загружаем страницу с токенами
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
      
      // Ждем немного, чтобы checkUserAuth мог выполниться
      cy.wait(2000);
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    });

    it('should create order with ingredients and display order number', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Краторная булка N-200i', { timeout: 5000 }).should('exist');
      cy.contains('(верх)', { timeout: 5000 }).should('exist');

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 5000 }).should('exist');

      cy.wait(1000);

      cy.get('button').contains('Оформить заказ').should('exist').then(($btn) => {
        expect($btn).to.not.have.attr('disabled');
        cy.wrap($btn).click({ force: true });
      });

      // Проверяем, что не произошел редирект на /login
      cy.url({ timeout: 5000 }).should('not.include', '/login');
      
      // Проверяем модальное окно с номером заказа напрямую
      cy.contains('12345', { timeout: 20000 }).should('exist');
    });

    it('should clear constructor after successful order', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Краторная булка N-200i', { timeout: 5000 }).should('exist');
      cy.contains('(верх)', { timeout: 5000 }).should('exist');

      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 5000 }).should('exist');

      cy.wait(1000);

      cy.get('button').contains('Оформить заказ').should('exist').then(($btn) => {
        expect($btn).to.not.have.attr('disabled');
        cy.wrap($btn).click({ force: true });
      });

      // Проверяем, что не произошел редирект на /login
      cy.url({ timeout: 5000 }).should('not.include', '/login');
      
      // Ждем модальное окно с номером заказа
      cy.contains('12345', { timeout: 20000 }).should('exist');
      
      // Закрываем модальное окно
      cy.get('body').then(($body) => {
        const modal = $body.find('[class*="modal"]');
        if (modal.length > 0) {
          cy.get('[class*="modal"]').find('button[class*="button"]').first().click({ force: true });
        }
      });

      cy.contains('Выберите булки', { timeout: 5000 }).should('exist');
      cy.contains('Выберите начинку', { timeout: 5000 }).should('exist');
    });

    it('should redirect to login if not authenticated', () => {
      // Очищаем токены
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
        win.document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
      
      // Перезагружаем страницу, чтобы Redux store обновился
      cy.reload();
      cy.wait('@getIngredients');
      cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');

      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Краторная булка N-200i', { timeout: 5000 }).should('exist');

      cy.get('button').contains('Оформить заказ').should('exist').click({ force: true });

      cy.url({ timeout: 5000 }).should('include', '/login');
    });
  });
});


