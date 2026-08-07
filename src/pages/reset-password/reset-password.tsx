import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ResetPasswordUI } from '../../components/ui/pages/reset-password/reset-password';
import { resetPassword } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const errorText = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token }));
  };

  return (
    <ResetPasswordUI
      errorText={errorText || undefined}
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
