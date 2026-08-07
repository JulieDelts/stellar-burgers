import { FC } from 'react';
import { AppHeaderUI } from '../ui/app-header';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors/user';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
