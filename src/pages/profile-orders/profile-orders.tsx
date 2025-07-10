import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  fetchUserOrders,
  selectIsLoading,
  selectUserOrders
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
