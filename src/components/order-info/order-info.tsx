import { FC, useEffect, useMemo, useState } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '../../utils/types';
import {
  selectUserOrdersLoading,
  selectUserOrders
} from '../../services/selectors/order';
import { selectFeeds, selectFeedsLoading } from '../../services/selectors/feed';
import { selectIngredients } from '../../services/selectors/ingredients';
import { fetchUserOrders } from '../../services/slices/order-slice';
import { fetchFeeds } from '../../services/slices/feed-slice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const feeds = useSelector(selectFeeds);
  const feedsLoading = useSelector(selectFeedsLoading);
  const userOrders = useSelector(selectUserOrders);
  const userOrdersLoading = useSelector(selectUserOrdersLoading);

  const [singleOrder, setSingleOrder] = useState<TOrder | null>(null);
  const [singleOrderLoading, setSingleOrderLoading] = useState(false);
  const [singleOrderError, setSingleOrderError] = useState<string | null>(null);

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
    const fetchOrderByNumber = async () => {
      if (!number || orderFromStore || singleOrder || singleOrderLoading)
        return;

      try {
        setSingleOrderLoading(true);
        setSingleOrderError(null);
        const response = await getOrderByNumberApi(Number(number));
        if (response.success && response.orders.length > 0) {
          setSingleOrder(response.orders[0]);
        } else {
          setSingleOrderError('Заказ не найден');
        }
      } catch (error) {
        setSingleOrderError(
          (error as { message?: string }).message || 'Ошибка загрузки заказа'
        );
      } finally {
        setSingleOrderLoading(false);
      }
    };

    fetchOrderByNumber();
  }, [number, orderFromStore, singleOrder, singleOrderLoading]);

  const orderData = orderFromStore || singleOrder;

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
    (!orderData &&
      !singleOrderLoading &&
      ((isFeedRoute && feedsLoading) ||
        (isProfileOrdersRoute && userOrdersLoading) ||
        (!isFeedRoute && !isProfileOrdersRoute))) ||
    (!orderData && !singleOrder && !singleOrderError && !singleOrderLoading) ||
    !ingredients.length;

  if (isLoading || singleOrderLoading) {
    return <Preloader />;
  }

  if (!orderInfo || singleOrderError) {
    return (
      <div
        className='text text_type_main-medium pt-4'
        style={{ textAlign: 'center' }}
      >
        {singleOrderError || 'Заказ не найден'}
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
