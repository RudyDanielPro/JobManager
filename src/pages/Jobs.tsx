import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { jobOffers } from "@/data/mockData";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 5;

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      jobOffers.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
          j.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Ofertas de empleo</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} ofertas disponibles</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por título, tecnología o ubicación..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-3">
        {paginated.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {paginated.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No se encontraron ofertas para tu búsqueda.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
