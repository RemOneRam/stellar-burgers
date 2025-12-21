import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  ConstructorState
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 424,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: 'test-id-1'
};

const mockSauce: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: 'test-id-2'
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

describe('constructorSlice', () => {
  describe('addIngredient', () => {
    it('should add bun to constructor', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('should add main ingredient to constructor', () => {
      const action = addIngredient(mockMain);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockMain);
    });

    it('should replace bun when adding new bun', () => {
      const stateWithBun = constructorReducer(initialState, addIngredient(mockBun));
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const action = addIngredient(newBun);
      const state = constructorReducer(stateWithBun, action);

      expect(state.bun).toEqual(newBun);
      expect(state.bun?._id).toBe('new-bun-id');
    });

    it('should add multiple ingredients', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toEqual(mockMain);
      expect(state.ingredients[1]).toEqual(mockSauce);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);

      const action = removeIngredient('test-id-1');
      state = constructorReducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockSauce);
    });

    it('should not remove ingredient if id does not match', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));

      const action = removeIngredient('non-existent-id');
      state = constructorReducer(state, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockMain);
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from one position to another', () => {
      const mockIngredient3: TConstructorIngredient = {
        ...mockMain,
        id: 'test-id-3'
      };

      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockIngredient3));

      expect(state.ingredients[0].id).toBe('test-id-1');
      expect(state.ingredients[1].id).toBe('test-id-2');
      expect(state.ingredients[2].id).toBe('test-id-3');

      const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
      state = constructorReducer(state, action);

      expect(state.ingredients[0].id).toBe('test-id-2');
      expect(state.ingredients[1].id).toBe('test-id-3');
      expect(state.ingredients[2].id).toBe('test-id-1');
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      const action = clearConstructor();
      state = constructorReducer(state, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});

