import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ForgotPasswordUI } from '../../components/ui/pages/forgot-password/forgot-password';
import { forgotPassword } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const errorText = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <ForgotPasswordUI
      errorText={errorText || undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
