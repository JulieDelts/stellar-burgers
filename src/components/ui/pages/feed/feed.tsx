import { FC } from 'react';
import { FeedUIProps } from './type';
import { FeedInfo } from '../../../feed-info';
import styles from './feed.module.css';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { OrdersList } from '../../../orders-list';

export const FeedUI: FC<FeedUIProps> = ({ orders, handleGetFeeds }) => (
  <main className={styles.containerMain}>
    <div className={`${styles.titleBox} mt-10 mb-5`}>
      <h1 className={`${styles.title} text text_type_main-large`}>
        Лента заказов
      </h1>
      <RefreshButton
        text='Обновить'
        onClick={handleGetFeeds}
        extraClass={'ml-30'}
      />
    </div>
    <div className={styles.main}>
      <div className={styles.columnOrders}>
        {orders.length > 0 ? (
          <OrdersList orders={orders} />
        ) : (
          <p className='text text_type_main-medium'>Нет заказов</p>
        )}
      </div>
      <div className={styles.columnInfo}>
        <FeedInfo />
      </div>
    </div>
  </main>
);
