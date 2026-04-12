import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, LogOut, User, ChevronDown, Shield, Plus, Menu, X, Building2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CreateOfferModal from "@/components/CreateOfferModal";

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const getUserInitials = () => {
    return currentUser?.usuario?.charAt(0).toUpperCase() || "U";
  };

  const getDisplayName = () => {
    return currentUser?.usuario || "Usuario";
  };

  const isRecruiter = currentUser?.rol?.toLowerCase() === "recruiter" || currentUser?.rol?.toLowerCase() === "reclutador";
  const isCandidate = currentUser?.rol?.toLowerCase() === "candidato";
  const isAdmin = currentUser?.rol?.toLowerCase() === "admin";

  const userFotoUrl = currentUser?.foto?.ruta || currentUser?.fotoUrl;
  
  // Verificar rutas
  const isCompanyDashboard = location.pathname === "/company/dashboard";
  const isCompanyJobs = location.pathname === "/company/jobs";

  const refreshOfertas = () => {
    if (window.location.pathname === "/company/dashboard") {
      window.location.reload();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo - siempre visible */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">DevJobs</span>
          </Link>

          {/* Navegación - solo visible en desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {/* Mostrar enlaces según la ruta actual */}
            {isCompanyDashboard && isAuthenticated && isRecruiter && (
              <>
                <Link to="/jobs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Explorar Ofertas
                </Link>
              </>
            )}
            
            {isCompanyJobs && isAuthenticated && isRecruiter && (
              <>
                <Link to="/company/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Mis Ofertas
                </Link>
                <Link to="/jobs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Explorar Ofertas
                </Link>
              </>
            )}
            
            {/* Links para usuarios autenticados (fuera de rutas de reclutador) */}
            {!isCompanyDashboard && !isCompanyJobs && isAuthenticated && isAdmin && (
              <Link to="/admin/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Panel Admin
              </Link>
            )}
            {!isCompanyDashboard && !isCompanyJobs && isAuthenticated && isRecruiter && (
              <Link to="/company/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Building2 className="inline h-3.5 w-3.5 mr-1" />
                  Mis Ofertas
                </Link>
            )}
            {!isCompanyDashboard && !isCompanyJobs && isAuthenticated && isCandidate && (
              <Link to="/candidate/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Mis Aplicaciones
              </Link>
            )}
            
            {/* Enlace a Jobs para usuarios no autenticados */}
            
          </nav>

          <div className="flex items-center gap-3">
            {/* Botón Publicar Oferta - Solo visible en dashboard del reclutador */}
            {isCompanyDashboard && isAuthenticated && isRecruiter && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="hidden md:flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span>Publicar oferta</span>
              </button>
            )}

            {/* Usuario autenticado */}
            {isAuthenticated && currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <div className="flex h-6 w-6 overflow-hidden items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {userFotoUrl ? (
                      <img src={userFotoUrl} alt="Perfil" className="h-full w-full object-cover" />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <span className="hidden sm:inline">{getDisplayName()}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg">
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/profile"); }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <User className="h-4 w-4" />
                      Perfil
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario no autenticado - solo mostrar botones de login y registro */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
            {isCompanyDashboard && isAuthenticated && isRecruiter && (
              <>
                <Link to="/jobs" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  Explorar Ofertas
                </Link>
              </>
            )}
            
            {isCompanyJobs && isAuthenticated && isRecruiter && (
              <>
                <Link to="/company/dashboard" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  Mis Ofertas
                </Link>
                <Link to="/jobs" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  Explorar Ofertas
                </Link>
              </>
            )}
            
            {!isCompanyDashboard && !isCompanyJobs && isAuthenticated && isAdmin && (
              <Link to="/admin/dashboard" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Panel Admin
              </Link>
            )}
            {!isCompanyDashboard && !isCompanyJobs && isAuthenticated && isRecruiter && (
              <Link to="/company/dashboard" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Mis Ofertas
              </Link>
            )}
            {!isCompanyDashboard && !isCompanyJobs && isAuthenticated && isCandidate && (
              <Link to="/candidate/dashboard" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Mis Aplicaciones
              </Link>
            )}
            
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link to="/register" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
            
            {/* Botón Publicar Oferta en móvil */}
            {isCompanyDashboard && isAuthenticated && isRecruiter && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowCreateModal(true);
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Publicar oferta
              </button>
            )}
          </div>
        )}
      </header>

      <CreateOfferModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={refreshOfertas}
      />
    </>
  );
}