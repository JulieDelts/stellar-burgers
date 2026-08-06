import { FC, useEffect, useMemo } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '../../utils/types';
import {
  selectIngredients,
  selectFeeds,
  selectFeedsLoading,
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/selectors/data';
import { fetchFeeds, fetchUserOrders } from '../../services/slices/data-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const feeds = useSelector(selectFeeds);
  const feedsLoading = useSelector(selectFeedsLoading);
  const userOrders = useSelector(selectUserOrders);
  const userOrdersLoading = useSelector(selectUserOrdersLoading);

  const isFeedRoute = useMatch('/feed/:number');
  const isProfileOrdersRoute = useMatch('/profile/orders/:number');

  useEffect(() => {
    if (isFeedRoute && !feeds.length && !feedsLoading) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, feeds.length, feedsLoading, isFeedRoute]);

  useEffect(() => {
    if (isProfileOrdersRoute && !userOrders.length && !userOrdersLoading) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isProfileOrdersRoute, userOrders.length, userOrdersLoading]);

  const orderData =
    userOrders.find((item) => item.number === Number(number)) ||
    feeds.find((item) => item.number === Number(number));

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  const isLoading =
    (!orderData && isFeedRoute && feedsLoading) ||
    (!orderData && isProfileOrdersRoute && userOrdersLoading) ||
    (!orderData && !ingredients.length);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <div className='text text_type_main-medium pt-4'>Заказ не найден</div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
