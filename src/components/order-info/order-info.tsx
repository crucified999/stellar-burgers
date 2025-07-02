import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  fetchOrderByNumber,
  fetchUserOrders,
  IBurgerState,
  selectIngredients,
  selectOrderModalData,
  selectOrders,
  selectUserOrders
} from '../../slices/burgerSlice';
import { useLocation, useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  // if (!params.number) {
  //   redirect('/feed');
  //   return null;
  // }

  // const orders =
  //   location.pathname === `/feed/${params.number}`
  //     ? useSelector(selectOrders)
  //     : useSelector(selectUserOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // const orderData = orders.find(
  //   (item) => item.number === parseInt(params.number!)
  // );

  const orderData = useSelector(selectOrderModalData);

  useEffect(() => {
    dispatch(fetchOrderByNumber(Number(number)));
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
