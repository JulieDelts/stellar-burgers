import { expect, test, describe } from '@jest/globals';
import burgerConstructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setBun,
  clear
} from './burger-constructor-slice';
import type { ConstructorState } from './burger-constructor-slice';
import { createOrder } from './order-slice';
import { TConstructorIngredient, TOrder } from '../../utils/types';

const burgerConstructorSliceReducer = burgerConstructorSlice.reducer;

const mockOrder: TOrder = {
  _id: 'order-123',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2', '1']
};

const mockBun: TConstructorIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image-url',
  image_large: 'image-large-url',
  image_mobile: 'image-mobile-url',
  id: 'bun-1'
};

const mockAnotherBun: TConstructorIngredient = {
  _id: '10',
  name: 'Другая булка',
  type: 'bun',
  proteins: 90,
  fat: 30,
  carbohydrates: 60,
  calories: 500,
  price: 1500,
  image: 'image-url',
  image_large: 'image-large-url',
  image_mobile: 'image-mobile-url',
  id: 'bun-2'
};

const mockIngredient1: TConstructorIngredient = {
  _id: '2',
  name: 'Котлета',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'image-url',
  image_large: 'image-large-url',
  image_mobile: 'image-mobile-url',
  id: 'ingredient-1'
};

const mockIngredient2: TConstructorIngredient = {
  _id: '3',
  name: 'Соус',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 300,
  price: 500,
  image: 'image-url',
  image_large: 'image-large-url',
  image_mobile: 'image-mobile-url',
  id: 'ingredient-2'
};

const mockIngredient3: TConstructorIngredient = {
  _id: '4',
  name: 'Сыр',
  type: 'main',
  proteins: 50,
  fat: 35,
  carbohydrates: 45,
  calories: 550,
  price: 750,
  image: 'image-url',
  image_large: 'image-large-url',
  image_mobile: 'image-mobile-url',
  id: 'ingredient-3'
};

const defaultState: ConstructorState = {
  bun: null,
  ingredients: []
};

describe('Тесты редьюсера burgerConstructorSlice', () => {
  describe('Обработка неизвестного экшена', () => {
    test('Возвращает начальное состояние при неизвестном экшене и undefined-состоянии', () => {
      const result = burgerConstructorSliceReducer(undefined, {
        type: 'UNKNOWN'
      });
      expect(result).toEqual(defaultState);
    });

    test('Возвращает текущее состояние при неизвестном экшене', () => {
      const filledState: ConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1]
      };

      const result = burgerConstructorSliceReducer(filledState, {
        type: 'UNKNOWN'
      });

      expect(result).toEqual(filledState);
    });
  });

  describe('Тесты синхронных экшенов', () => {
    describe('addIngredient', () => {
      test('Добавляет ингредиент в пустой конструктор', () => {
        const newState = burgerConstructorSliceReducer(
          defaultState,
          addIngredient(mockIngredient1)
        );

        expect(newState.ingredients).toHaveLength(1);
        expect(newState.ingredients[0]).toEqual(mockIngredient1);
      });

      test('Добавляет ингредиент в конец списка', () => {
        const stateWithOne: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1]
        };

        const newState = burgerConstructorSliceReducer(
          stateWithOne,
          addIngredient(mockIngredient2)
        );

        expect(newState.ingredients).toHaveLength(2);
        expect(newState.ingredients[0]).toEqual(mockIngredient1);
        expect(newState.ingredients[1]).toEqual(mockIngredient2);
      });

      test('Не изменяет булку при добавлении начинки', () => {
        const stateWithBun: ConstructorState = {
          bun: mockBun,
          ingredients: []
        };

        const newState = burgerConstructorSliceReducer(
          stateWithBun,
          addIngredient(mockIngredient1)
        );

        expect(newState.bun).toEqual(mockBun);
        expect(newState.ingredients).toHaveLength(1);
      });
    });

    describe('removeIngredient', () => {
      test('Удаляет ингредиент по индексу из начала списка', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          removeIngredient(0)
        );

        expect(newState.ingredients).toHaveLength(2);
        expect(newState.ingredients[0]).toEqual(mockIngredient2);
        expect(newState.ingredients[1]).toEqual(mockIngredient3);
      });

      test('Удаляет ингредиент по индексу из середины списка', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          removeIngredient(1)
        );

        expect(newState.ingredients).toHaveLength(2);
        expect(newState.ingredients[0]).toEqual(mockIngredient1);
        expect(newState.ingredients[1]).toEqual(mockIngredient3);
      });

      test('Удаляет последний ингредиент', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          removeIngredient(0)
        );

        expect(newState.ingredients).toHaveLength(0);
      });
    });

    describe('moveIngredientUp', () => {
      test('Перемещает ингредиент вверх', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1, mockIngredient2]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          moveIngredientUp(1)
        );

        expect(newState.ingredients[0]).toEqual(mockIngredient2);
        expect(newState.ingredients[1]).toEqual(mockIngredient1);
      });

      test('Не перемещает первый ингредиент', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1, mockIngredient2]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          moveIngredientUp(0)
        );

        expect(newState.ingredients[0]).toEqual(mockIngredient1);
        expect(newState.ingredients[1]).toEqual(mockIngredient2);
      });
    });

    describe('moveIngredientDown', () => {
      test('Перемещает ингредиент вниз', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1, mockIngredient2]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          moveIngredientDown(0)
        );

        expect(newState.ingredients[0]).toEqual(mockIngredient2);
        expect(newState.ingredients[1]).toEqual(mockIngredient1);
      });

      test('Не перемещает последний ингредиент', () => {
        const state: ConstructorState = {
          bun: null,
          ingredients: [mockIngredient1, mockIngredient2]
        };

        const newState = burgerConstructorSliceReducer(
          state,
          moveIngredientDown(1)
        );

        expect(newState.ingredients[0]).toEqual(mockIngredient1);
        expect(newState.ingredients[1]).toEqual(mockIngredient2);
      });
    });

    describe('setBun', () => {
      test('Устанавливает булку в пустой конструктор', () => {
        const newState = burgerConstructorSliceReducer(
          defaultState,
          setBun(mockBun)
        );

        expect(newState.bun).toEqual(mockBun);
        expect(newState.bun?.name).toBe('Булка');
      });

      test('Заменяет текущую булку на новую', () => {
        const stateWithBun: ConstructorState = {
          bun: mockBun,
          ingredients: [mockIngredient1]
        };

        const newState = burgerConstructorSliceReducer(
          stateWithBun,
          setBun(mockAnotherBun)
        );

        expect(newState.bun).toEqual(mockAnotherBun);
        expect(newState.bun?.name).toBe('Другая булка');
        expect(newState.ingredients).toEqual([mockIngredient1]);
      });
    });

    describe('clear', () => {
      test('Очищает конструктор полностью', () => {
        const filledState: ConstructorState = {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
        };

        const newState = burgerConstructorSliceReducer(filledState, clear());

        expect(newState.bun).toBeNull();
        expect(newState.ingredients).toHaveLength(0);
      });

      test('Очищает пустой конструктор без ошибок', () => {
        const newState = burgerConstructorSliceReducer(defaultState, clear());

        expect(newState.bun).toBeNull();
        expect(newState.ingredients).toHaveLength(0);
      });
    });
  });

  describe('Тесты асинхронных экшенов (createOrder)', () => {
    test('createOrder.pending: не изменяет конструктор', () => {
      const filledState: ConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const newState = burgerConstructorSliceReducer(
        filledState,
        createOrder.pending('requestId', ['1', '2', '1'])
      );

      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    });

    test('createOrder.rejected: не изменяет конструктор', () => {
      const filledState: ConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const newState = burgerConstructorSliceReducer(
        filledState,
        createOrder.rejected(new Error('Ошибка'), 'requestId', ['1', '2', '1'])
      );

      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients).toEqual([mockIngredient1, mockIngredient2]);
    });

    test('createOrder.fulfilled: очищает конструктор', () => {
      const filledState: ConstructorState = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const newState = burgerConstructorSliceReducer(
        filledState,
        createOrder.fulfilled(mockOrder, 'requestId', ['1', '2', '1'])
      );

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });
});
