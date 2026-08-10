import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '../ui/burger-constructor-element';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient
} from '../../services/slices/burger-constructor-slice';

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
    dispatch(removeIngredient(index));
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
