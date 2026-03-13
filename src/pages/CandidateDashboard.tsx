import { useAuth } from "@/context/AuthContext";
import { getApplicationsForCandidate } from "@/data/mockData";
import { FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
  const { currentUser } = useAuth();
  const apps = getApplicationsForCandidate(currentUser?.id || "");

  const statusStyles: Record<string, string> = {
    PENDING: "bg-warning/10 text-warning",
    REVIEWED: "bg-info/10 text-info",
    ACCEPTED: "bg-success/10 text-success",
    REJECTED: "bg-destructive/10 text-destructive",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    REVIEWED: "En revisión",
    ACCEPTED: "Aceptada",
    REJECTED: "Rechazada",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis Aplicaciones</h1>
        <p className="mt-1 text-sm text-muted-foreground">Revisa el estado de tus postulaciones</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"] as const).map((status) => (
          <div key={status} className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{apps.filter((a) => a.status === status).length}</p>
            <p className="text-sm text-muted-foreground">{statusLabels[status]}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {apps.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">Aún no has aplicado a ninguna oferta.</p>
            <Link to="/jobs" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Explorar ofertas <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          apps.map((app) => (
            <Link key={app.id} to={`/jobs/${app.jobOfferId}`} className="block">
              <div className="card-hover flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {app.company?.logo}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{app.job?.title}</p>
                    <p className="text-sm text-muted-foreground">{app.company?.name} · Aplicado el {app.appliedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{app.cvFileName}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[app.status]}`}>
                    {statusLabels[app.status]}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
