import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Settings, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

export type TabType = 'dashboard' | 'users' | 'companies' | 'offers' | 'postulations';

interface NavItem {
  id: TabType;
  label: string;
  icon: any;
  count?: number;
}

interface AdminSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  counts?: {
    users?: number;
    companies?: number;
    offers?: number;
    postulations?: number;
  };
}

export default function AdminSidebar({ activeTab, onTabChange, counts }: AdminSidebarProps) {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuarios', icon: Users, count: counts?.users },
    { id: 'companies', label: 'Empresas', icon: Building2, count: counts?.companies },
    { id: 'offers', label: 'Ofertas', icon: Briefcase, count: counts?.offers },
    { id: 'postulations', label: 'Postulaciones', icon: FileText, count: counts?.postulations },
  ];

  const handleHelpClick = () => {
    toast.info('📞 Soporte: soporte@devjobs.com | Documentación: docs.devjobs.com');
  };

  const handleSettingsClick = () => {
    toast.info('⚙️ Configuración disponible próximamente');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground">AdminPanel</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">v1.0</span>
      </div>

      <nav className="p-4">
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Principal</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-xs ${
                  activeTab === item.id ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Soporte</p>
          <button
            onClick={handleHelpClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Ayuda</span>
          </button>
          <button
            onClick={handleSettingsClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </button>
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-secondary/50 p-4">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xs font-medium text-foreground">Panel Admin</p>
            <p className="text-xs text-muted-foreground">Control total del sistema</p>
          </div>
        </div>
      </div>
    </aside>
  );
}