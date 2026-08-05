import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '../../utils/types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectFeeds,
  selectFeedsTotal,
  selectFeedsTotalToday
} from '../../services/selectors/data';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeeds);
  const total = useSelector(selectFeedsTotal);
  const totalToday = useSelector(selectFeedsTotalToday);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const feed = {
    total: total || 0,
    totalToday: totalToday || 0
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
