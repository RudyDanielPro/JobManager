import { Bell, Settings, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sesión cerrada correctamente');
  };

  const handleGoToProfile = () => {
    setShowMenu(false);
    navigate('/profile');
  };

  const handleGoToSettings = () => {
    setShowMenu(false);
    navigate('/settings');
    toast.info('Configuración en desarrollo');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    toast.info('Próximamente: Centro de notificaciones');
  };

  const handleHelpClick = () => {
    toast.info('Ayuda: Contacta con soporte@devjobs.com');
  };

  // ✅ Obtener la URL de la foto del admin
  const userPhotoUrl = currentUser?.foto?.ruta || currentUser?.fotoUrl || null;

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2 transition-colors hover:bg-secondary"
              >
                {/* ✅ Avatar con foto o inicial */}
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {userPhotoUrl ? (
                    <img 
                      src={userPhotoUrl} 
                      alt={currentUser?.usuario || 'Admin'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser?.usuario?.charAt(0).toUpperCase() || 'A'
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{currentUser?.usuario}</span>
                <Shield className="h-4 w-4 text-primary" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-card shadow-lg">
                  <div className="border-b border-border p-3">
                    <div className="flex items-center gap-3">
                      {/* ✅ Avatar en el menú desplegable */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {userPhotoUrl ? (
                          <img 
                            src={userPhotoUrl} 
                            alt={currentUser?.usuario || 'Admin'} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          currentUser?.usuario?.charAt(0).toUpperCase() || 'A'
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{currentUser?.usuario}</p>
                        <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                      </div>
                    </div>
                    <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Administrador
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleGoToProfile}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <User className="h-4 w-4" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={handleGoToSettings}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <Settings className="h-4 w-4" />
                      Configuración
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}