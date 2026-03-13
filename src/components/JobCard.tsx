import { Link } from "react-router-dom";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { JobOffer, getCompanyById } from "@/data/mockData";

interface JobCardProps {
  job: JobOffer;
}

export default function JobCard({ job }: JobCardProps) {
  const company = getCompanyById(job.companyId);

  return (
    <Link to={`/jobs/${job.id}`} className="group block">
      <div className="card-hover rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {company?.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{company?.name}</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {job.type}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.postedAt}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
