import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthorized } from '../../slices/burgerSlice';
interface PotectedRouteProps {
  authorizedOnly: boolean;
}

export const ProtectedRoute = ({ authorizedOnly }: PotectedRouteProps) => {
  const location = useLocation();
  const isAuthorized = useSelector(selectIsAuthorized);

  if (!authorizedOnly && !isAuthorized) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (authorizedOnly && isAuthorized) {
    const from = location.state?.from;
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
