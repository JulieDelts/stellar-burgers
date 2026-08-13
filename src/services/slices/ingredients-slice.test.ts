import { expect, test, describe } from '@jest/globals';
import ingredientsSlice, {
  clearError,
  fetchIngredients
} from './ingredients-slice';
import type { IngredientsState } from './ingredients-slice';
import { TIngredient } from '../../utils/types';

const ingredientsSliceReducer = ingredientsSlice.reducer;

const mockIngredients: TIngredient[] = [
  {
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
    image_mobile: 'image-mobile-url'
  },
  {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'image-url',
    image_large: 'image-large-url',
    image_mobile: 'image-mobile-url'
  }
];

const defaultState: IngredientsState = {
  data: [],
  loading: false,
  error: null
};

describe('Тесты редьюсера ingredientsSlice', () => {
  describe('Обработка неизвестного экшена', () => {
    test('Возвращает начальное состояние при неизвестном экшене и undefined-состоянии', () => {
      const result = ingredientsSliceReducer(undefined, { type: 'UNKNOWN' });
      expect(result).toEqual(defaultState);
    });

    test('Возвращает текущее состояние при неизвестном экшене', () => {
      const stateWithData: IngredientsState = {
        data: mockIngredients,
        loading: false,
        error: null
      };

      const result = ingredientsSliceReducer(stateWithData, {
        type: 'UNKNOWN'
      });

      expect(result).toEqual(stateWithData);
    });
  });

  describe('Тесты синхронных экшенов', () => {
    test('clearError: сбрасывает ошибку в null', () => {
      const stateWithError: IngredientsState = {
        data: [],
        loading: false,
        error: 'Ошибка загрузки ингредиентов'
      };

      const newState = ingredientsSliceReducer(stateWithError, clearError());

      expect(newState.error).toBeNull();
    });

    test('clearError: сохраняет данные и loading без изменений', () => {
      const stateWithError: IngredientsState = {
        data: mockIngredients,
        loading: false,
        error: 'Ошибка'
      };

      const newState = ingredientsSliceReducer(stateWithError, clearError());

      expect(newState.data).toEqual(mockIngredients);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('Тесты асинхронных экшенов (fetchIngredients)', () => {
    test('fetchIngredients.pending: устанавливает loading в true и сбрасывает error', () => {
      const stateWithError: IngredientsState = {
        data: [],
        loading: false,
        error: 'Предыдущая ошибка'
      };

      const newState = ingredientsSliceReducer(
        stateWithError,
        fetchIngredients.pending('requestId', undefined)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.data).toEqual([]);
    });

    test('fetchIngredients.fulfilled: записывает данные и сбрасывает loading', () => {
      const loadingState: IngredientsState = {
        data: [],
        loading: true,
        error: null
      };

      const newState = ingredientsSliceReducer(
        loadingState,
        fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.data).toEqual(mockIngredients);
      expect(newState.data).toHaveLength(2);
    });

    test('fetchIngredients.rejected: записывает ошибку из payload', () => {
      const loadingState: IngredientsState = {
        data: [],
        loading: true,
        error: null
      };

      const newState = ingredientsSliceReducer(
        loadingState,
        fetchIngredients.rejected(
          new Error('Ошибка'),
          'requestId',
          undefined,
          'Сетевая ошибка'
        )
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Сетевая ошибка');
      expect(newState.data).toEqual([]);
    });

    test('fetchIngredients.rejected: использует дефолтное сообщение если payload отсутствует', () => {
      const loadingState: IngredientsState = {
        data: [],
        loading: true,
        error: null
      };

      const newState = ingredientsSliceReducer(
        loadingState,
        fetchIngredients.rejected(
          new Error('Ошибка'),
          'requestId',
          undefined,
          undefined
        )
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки ингредиентов');
    });

    test('fetchIngredients.rejected: сохраняет существующие данные при ошибке', () => {
      const loadingState: IngredientsState = {
        data: mockIngredients,
        loading: true,
        error: null
      };

      const newState = ingredientsSliceReducer(
        loadingState,
        fetchIngredients.rejected(
          new Error('Ошибка'),
          'requestId',
          undefined,
          'Сетевая ошибка'
        )
      );

      expect(newState.data).toEqual(mockIngredients);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Сетевая ошибка');
    });
  });
});
