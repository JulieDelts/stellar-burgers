import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  addIngredientToConstructor,
  setBun
} from '../../services/slices/data-slice';
import { BurgerIngredientUI } from '../ui/burger-ingredient';
import { TBurgerIngredientProps } from './type';
import { TConstructorIngredient } from '../../utils/types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: `${ingredient._id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      if (ingredient.type === 'bun') {
        dispatch(setBun(constructorIngredient));
      } else {
        dispatch(addIngredientToConstructor(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);

BurgerIngredient.displayName = 'BurgerIngredient';
