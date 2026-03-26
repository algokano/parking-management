import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
