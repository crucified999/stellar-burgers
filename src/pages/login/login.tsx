import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchLoginUser } from '../../slices/burgerSlice';
import { setCookie } from '../../utils/cookie';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await dispatch(
      fetchLoginUser({ email: values.email, password: values.password })
    )
      .unwrap()
      .then((payload) => {
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      });

    navigate(from.pathname, { replace: true });
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={handleChange}
      password={values.password}
      setPassword={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
