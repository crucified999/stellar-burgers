import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchRegisterUser,
  getUserThunk,
  selectIsLoading
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';
import { setCookie } from '../../utils/cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await dispatch(
      fetchRegisterUser({
        name: values.userName,
        email: values.email,
        password: values.password
      })
    )
      .unwrap()
      .then((payload) => {
        localStorage.setItem('refreshToken', payload.refreshToken);
        setCookie('accessToken', payload.accessToken);
        dispatch(getUserThunk());
      });

    navigate('/', { replace: true });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText=''
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={handleChange}
      setPassword={handleChange}
      setUserName={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
