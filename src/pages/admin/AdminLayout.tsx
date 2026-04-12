import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout() {
  const { currentUser, isAuthenticated } = useAuth();

  // Redirige al inicio si no está autenticado o no es Admin
  if (!isAuthenticated || currentUser?.rol?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}