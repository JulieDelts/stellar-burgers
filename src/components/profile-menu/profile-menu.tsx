import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user-slice';
import { ProfileMenuUI } from '../ui/profile-menu';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
