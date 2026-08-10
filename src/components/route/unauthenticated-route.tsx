import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectUserChecked
} from '../../services/selectors/user';
import { Preloader } from '../ui/preloader';

interface UnauthenticatedRouteProps {
  children: ReactNode;
}

export const UnauthenticatedRoute: FC<UnauthenticatedRouteProps> = ({
  children
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userChecked = useSelector(selectUserChecked);

  if (!userChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
