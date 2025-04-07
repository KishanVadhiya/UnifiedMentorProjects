import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../layout/Loader';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;