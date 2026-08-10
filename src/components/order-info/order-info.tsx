import { FC, useEffect, useMemo } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '../../utils/types';
import {
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserCurrentOrder,
  selectUserCurrentOrderLoading,
  selectUserCurrentOrderError,
  selectUserOrdersError
} from '../../services/selectors/order';
import { selectFeeds, selectFeedsLoading } from '../../services/selectors/feed';
import { selectIngredients } from '../../services/selectors/ingredients';
import {
  fetchUserOrders,
  fetchOrderByNumber
} from '../../services/slices/order-slice';
import { fetchFeeds } from '../../services/slices/feed-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const feeds = useSelector(selectFeeds);
  const feedsLoading = useSelector(selectFeedsLoading);
  const userOrders = useSelector(selectUserOrders);
  const userOrdersLoading = useSelector(selectUserOrdersLoading);
  const userOrdersError = useSelector(selectUserOrdersError);
  const currentOrder = useSelector(selectUserCurrentOrder);
  const currentOrderLoading = useSelector(selectUserCurrentOrderLoading);
  const currentOrderError = useSelector(selectUserCurrentOrderError);

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

  const orderFromStore =
    userOrders.find((item) => item.number === Number(number)) ||
    feeds.find((item) => item.number === Number(number));

  useEffect(() => {
    if (!number) return;

    if (currentOrderLoading || currentOrder) return;

    dispatch(fetchOrderByNumber(Number(number)));
  }, [number, orderFromStore, currentOrder, currentOrderLoading, dispatch]);

  const orderData = orderFromStore || currentOrder;

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
    !orderData &&
    ((isFeedRoute && feedsLoading) ||
      (isProfileOrdersRoute && userOrdersLoading) ||
      currentOrderLoading ||
      !ingredients.length);

  if (isLoading) {
    return <Preloader />;
  }

  if (userOrdersError || currentOrderError) {
    return (
      <div
        className='text text_type_main-medium pt-4'
        style={{ textAlign: 'center' }}
      >
        {userOrdersError ?? currentOrderError}
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div
        className='text text_type_main-medium pt-4'
        style={{ textAlign: 'center' }}
      >
        Заказ не найден
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
