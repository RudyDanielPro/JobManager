import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, DollarSign, Clock, Building2, Users } from "lucide-react";
import { getJobById, getCompanyById, getApplicationsForJob } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import ApplyModal from "@/components/ApplyModal";
import { toast } from "sonner";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);

  const job = getJobById(id || "");
  const company = job ? getCompanyById(job.companyId) : undefined;
  const jobApplications = job ? getApplicationsForJob(job.id) : [];

  if (!job || !company) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Oferta no encontrada.</p>
        <Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a ofertas
        </Link>
      </div>
    );
  }

  const handleApply = (coverLetter: string, fileName: string) => {
    setShowApplyModal(false);
    setHasApplied(true);
    toast.success("Aplicación enviada correctamente", {
      description: `Tu CV (${fileName}) ha sido enviado a ${company.name}.`,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Volver a ofertas
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {company.logo}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <p className="mt-0.5 text-muted-foreground">{company.name}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <DollarSign className="h-3.5 w-3.5" /> {job.salary}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                <Clock className="h-3.5 w-3.5" /> {job.postedAt}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground">Descripción del puesto</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{job.description}</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-sm">
                {company.logo}
              </div>
              <div>
                <p className="font-semibold text-foreground">{company.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Empresa verificada
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>

            <div className="mt-6">
              {currentUser?.role === "CANDIDATE" ? (
                hasApplied ? (
                  <div className="rounded-lg bg-success/10 px-4 py-3 text-center text-sm font-medium text-success">
                    ✓ Ya has aplicado a esta oferta
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Aplicar ahora
                  </button>
                )
              ) : currentUser?.role === "RECRUITER" ? (
                <button
                  onClick={() => setShowCandidates(!showCandidates)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Users className="h-4 w-4" />
                  Ver Candidatos ({jobApplications.length})
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Inicia sesión para aplicar
                </Link>
              )}
            </div>
          </div>

          {showCandidates && jobApplications.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-card p-6 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-3">Candidatos</h3>
              <div className="space-y-3">
                {jobApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {app.candidate?.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{app.candidate?.name}</p>
                        <p className="text-xs text-muted-foreground">{app.cvFileName}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      app.status === "ACCEPTED" ? "bg-success/10 text-success" :
                      app.status === "REJECTED" ? "bg-destructive/10 text-destructive" :
                      app.status === "REVIEWED" ? "bg-info/10 text-info" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          jobTitle={job.title}
          companyName={company.name}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
        />
      )}
    </div>
  );
}
