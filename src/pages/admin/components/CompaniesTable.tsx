import { Eye, Trash2, Search, Download, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Empresa } from '@/lib/types';

interface CompaniesTableProps {
  companies: Empresa[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete?: (company: Empresa) => void;
  onView?: (company: Empresa) => void;
}

export default function CompaniesTable({ 
  companies, 
  totalPages, 
  currentPage, 
  onPageChange,
  onDelete,
  onView
}: CompaniesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    searchTerm === '' ||
    company.nombreEmpresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-80 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Web</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{company.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {company.nombreEmpresa?.charAt(0) || "E"}
                      </div>
                      <span className="font-medium text-foreground">{company.nombreEmpresa}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {company.descripcion?.substring(0, 50)}...
                  </td>
                  <td className="px-4 py-3">
                    {company.url ? (
                      <a href={company.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onView && (
                        <button onClick={() => onView(company)} className="rounded p-1 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(company)} className="rounded p-1 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}