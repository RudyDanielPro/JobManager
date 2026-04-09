// components/JobCard.tsx
import { Link } from "react-router-dom";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { type OfertaResponse } from "@/lib/ofertasService";

interface JobCardProps {
  job: OfertaResponse;
}

export default function JobCard({ job }: JobCardProps) {
  // Extraer iniciales del nombre de la empresa
  const getCompanyInitials = () => {
    if (!job.nombreEmpresa) return "EM";
    return job.nombreEmpresa
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Reciente";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  // Generar tags a partir del título
  const getTags = () => {
    const tags = [];
    if (job.titulo?.toLowerCase().includes("react")) tags.push("React");
    if (job.titulo?.toLowerCase().includes("node")) tags.push("Node.js");
    if (job.titulo?.toLowerCase().includes("python")) tags.push("Python");
    if (job.titulo?.toLowerCase().includes("java")) tags.push("Java");
    if (job.titulo?.toLowerCase().includes("frontend")) tags.push("Frontend");
    if (job.titulo?.toLowerCase().includes("backend")) tags.push("Backend");
    if (tags.length === 0) tags.push("Tecnología");
    return tags.slice(0, 3);
  };

  const tags = getTags();

  return (
    <Link to={`/jobs/${job.id}`} className="group block">
      <div className="card-hover rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start gap-4">
          {/* Logo / Iniciales de la empresa */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {getCompanyInitials()}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.titulo}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {job.nombreEmpresa || "Empresa Confidencial"}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {job.estado ? "Activa" : "Inactiva"}
              </span>
            </div>
            
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.ubicacion || "Remoto"}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                {job.rangoSalarial || "No especificado"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(job.fechaCreacion)}
              </span>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}