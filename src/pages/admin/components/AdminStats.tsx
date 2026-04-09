import { Users, Building2, Briefcase, FileText, TrendingUp, UserCheck, Clock, Activity, Shield } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: string;
}

const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">
          {value !== undefined && value !== null ? value.toLocaleString() : 0}
        </p>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

interface AdminStatsProps {
  stats?: {
    totalUsers: number;
    totalCandidates: number;
    totalCompanies: number;
    totalAdmins: number;
    totalOffers: number;
    activeOffers: number;
    totalPostulations: number;
    pendingPostulations: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted"></div>
              </div>
              <div className="h-12 w-12 animate-pulse rounded-full bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { title: 'Total Usuarios', value: stats.totalUsers ?? 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Candidatos', value: stats.totalCandidates ?? 0, icon: UserCheck, color: 'bg-green-500' },
    { title: 'Empresas', value: stats.totalCompanies ?? 0, icon: Building2, color: 'bg-purple-500' },
    { title: 'Administradores', value: stats.totalAdmins ?? 0, icon: Shield, color: 'bg-red-500' },
    { title: 'Ofertas Activas', value: stats.activeOffers ?? 0, icon: Briefcase, color: 'bg-orange-500' },
    { title: 'Total Ofertas', value: stats.totalOffers ?? 0, icon: Activity, color: 'bg-cyan-500' },
    { title: 'Postulaciones', value: stats.totalPostulations ?? 0, icon: FileText, color: 'bg-pink-500' },
    { title: 'Pendientes', value: stats.pendingPostulations ?? 0, icon: Clock, color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}