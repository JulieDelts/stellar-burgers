import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { LoginUI } from '../../components/ui/pages/login/login';
import { loginUser } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errorText = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
