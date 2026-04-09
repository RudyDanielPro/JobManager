import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminLayout() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || currentUser?.rol?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}