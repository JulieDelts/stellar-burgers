import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders/profile-orders';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/selectors/data';
import { fetchUserOrders } from '../../services/slices/data-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
