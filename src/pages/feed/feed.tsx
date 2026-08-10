import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../../components/ui/preloader';
import { FeedUI } from '../../components/ui/pages/feed/feed';
import { fetchFeeds } from '../../services/slices/feed-slice';
import {
  selectFeeds,
  selectFeedsLoading,
  selectFeedsError
} from '../../services/selectors/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);
  const isLoading = useSelector(selectFeedsLoading);
  const error = useSelector(selectFeedsError);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium pt-4'>Ошибка: {error}</div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
