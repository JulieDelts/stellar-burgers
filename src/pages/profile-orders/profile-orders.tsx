import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders/profile-orders';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeeds } from '../../services/selectors/data';
import { fetchFeeds } from '../../services/slices/data-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
