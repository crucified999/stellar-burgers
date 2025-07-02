import {
  ConstructorPage,
  Register,
  NotFound404,
  Feed,
  Login,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ProtectedRoute } from '../protected-route/index';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import {
  fetchIngredients,
  resetOrderModalData
} from '../../slices/burgerSlice';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { getUserThunk, selectIsAuthorized } from '../../slices/burgerSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getCookie('accessToken');
  const isAuthorized = useSelector(selectIsAuthorized);
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const handleCloseModal = () => {
    navigate(-1);
    dispatch(resetOrderModalData());
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    if (!isAuthorized && token) {
      dispatch(getUserThunk())
        .unwrap()
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    }
  }, []);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Routes location={backgroundLocation || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<ProtectedRoute authorizedOnly />}>
            <Route path='/login' element={<Login />} />
          </Route>
          <Route path='/register' element={<ProtectedRoute authorizedOnly />}>
            <Route path='/register' element={<Register />} />
          </Route>
          <Route
            path='/forgot-password'
            element={<ProtectedRoute authorizedOnly />}
          >
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Route>
          <Route
            path='/reset-password'
            element={<ProtectedRoute authorizedOnly />}
          >
            <Route path='/reset-password' element={<ResetPassword />} />
          </Route>
          <Route
            path='/profile'
            element={<ProtectedRoute authorizedOnly={false} />}
          >
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route
            path='/profile/orders'
            element={<ProtectedRoute authorizedOnly={false} />}
          >
            <Route path='/profile/orders' element={<ProfileOrders />} />
          </Route>
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route
            path='/profile/orders/:number'
            element={<ProtectedRoute authorizedOnly={false} />}
          >
            <Route path='/profile/orders/:number' element={<OrderInfo />} />
          </Route>

          <Route path='*' element={<NotFound404 />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Детали заказа' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={<ProtectedRoute authorizedOnly={false} />}
            >
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title='Детали заказа' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Route>
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
