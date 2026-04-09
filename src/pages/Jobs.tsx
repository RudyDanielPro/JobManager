import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { ofertasService, type OfertaResponse } from "@/lib/ofertasService";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfertas = async () => {
      setLoading(true);
      try {
        const pageToFetch = currentPage - 1;
        
        let response;
        if (search) {
          response = await ofertasService.buscar(search, undefined, pageToFetch, ITEMS_PER_PAGE);
        } else {
          response = await ofertasService.listarActivas(pageToFetch, ITEMS_PER_PAGE);
        }
        
        setOfertas(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error("Error cargando ofertas:", error);
        toast.error("Error al cargar las ofertas");
      } finally {
        setLoading(false);
      }
    };

    fetchOfertas();
  }, [currentPage, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Ofertas de empleo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Cargando..." : `${totalElements} ofertas disponibles`}
        </p>
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
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : ofertas.length > 0 ? (
          ofertas.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              {search ? "No se encontraron ofertas para tu búsqueda." : "No hay ofertas disponibles en este momento."}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
}