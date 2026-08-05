import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '../ui/burger-constructor-element';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredientUp,
  moveIngredientDown,
  removeIngredientFromConstructor
} from '../../services/slices/data-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = ({
  ingredient,
  index,
  totalItems
}) => {
  const dispatch = useDispatch();

  const handleMoveUp = () => {
    dispatch(moveIngredientUp(index));
  };

  const handleMoveDown = () => {
    dispatch(moveIngredientDown(index));
  };

  const handleClose = () => {
    dispatch(removeIngredientFromConstructor(index));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
};
