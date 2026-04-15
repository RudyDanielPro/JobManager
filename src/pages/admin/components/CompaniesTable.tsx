import { Eye, Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, ExternalLink, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Empresa } from '@/lib/types';

interface CompaniesTableProps {
  companies: Empresa[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete?: (company: Empresa) => void;
  onView?: (company: Empresa) => void;
  onEdit?: (company: Empresa) => void;
  onCreate?: (company: Partial<Empresa>) => Promise<void>;
  onUpdate?: (id: number, company: Partial<Empresa>) => Promise<void>;
}

export default function CompaniesTable({ 
  companies, 
  totalPages, 
  currentPage, 
  onPageChange,
  onDelete,
  onView,
  onEdit,
  onCreate,
  onUpdate
}: CompaniesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el modal de crear/editar empresa
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    descripcion: '',
    url: '',
    logo: null as File | null,
    logoUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const filteredCompanies = companies.filter(company =>
    searchTerm === '' ||
    company.nombreEmpresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener URL del logo de la empresa
  const getLogoUrl = (company: Empresa): string | null => {
    if (company.fotoUrl) {
      return company.fotoUrl;
    }
    if (company.fotoUrl) {
      return company.fotoUrl;
    }
    return null;
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setFormData({
      nombreEmpresa: '',
      descripcion: '',
      url: '',
      logo: null,
      logoUrl: ''
    });
    setShowModal(true);
  };

  const openEditModal = (company: Empresa) => {
    setEditingCompany(company);
    setFormData({
      nombreEmpresa: company.nombreEmpresa || '',
      descripcion: company.descripcion || '',
      url: company.url || '',
      logo: null,
      logoUrl: getLogoUrl(company) || ''
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        logo: file,
        logoUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombreEmpresa) {
      toast.error('El nombre de la empresa es obligatorio');
      return;
    }

    setLoading(true);
    try {
      if (editingCompany && onUpdate) {
        const updateData: any = {
          nombreEmpresa: formData.nombreEmpresa,
          descripcion: formData.descripcion,
          url: formData.url,
        };
        
        if (formData.logo) {
          updateData.logoFile = formData.logo;
        }
        
        await onUpdate(editingCompany.id, updateData);
        toast.success('Empresa actualizada correctamente');
      } else if (onCreate) {
        const createData: any = {
          nombreEmpresa: formData.nombreEmpresa,
          descripcion: formData.descripcion,
          url: formData.url,
        };
        
        if (formData.logo) {
          createData.logoFile = formData.logo;
        }
        
        await onCreate(createData);
        toast.success('Empresa creada correctamente');
      }
      
      setShowModal(false);
      setFormData({
        nombreEmpresa: '',
        descripcion: '',
        url: '',
        logo: null,
        logoUrl: ''
      });
    } catch (error: any) {
      const errorMsg = error.response?.data || error.message || 'Error al guardar la empresa';
      toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nombreEmpresa: '',
      descripcion: '',
      url: '',
      logo: null,
      logoUrl: ''
    });
    setEditingCompany(null);
  };

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
        <div className="flex gap-2">
          {onCreate && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Nueva Empresa
            </button>
          )}
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
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
              {filteredCompanies.map((company) => {
                const logoUrl = getLogoUrl(company);
                return (
                  <tr key={company.id} className="border-b border-border hover:bg-secondary/30">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{company.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* ✅ Logo de la empresa */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                          {logoUrl ? (
                            <img 
                              src={logoUrl} 
                              alt={company.nombreEmpresa} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-muted-foreground">
                              {company.nombreEmpresa?.charAt(0).toUpperCase() || "E"}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-foreground">{company.nombreEmpresa}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {company.descripcion?.substring(0, 50)}
                      {company.descripcion?.length > 50 ? '...' : ''}
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
                        {/* ✅ Botón Editar */}
                        {(onEdit || onUpdate) && (
                          <button onClick={() => openEditModal(company)} className="rounded p-1 text-green-600 hover:bg-green-50">
                            <Edit className="h-4 w-4" />
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
                );
              })}
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

      {/* Modal de Crear/Editar Empresa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
              </h2>
              <button onClick={handleCloseModal} className="rounded p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Nombre de la empresa *</label>
                <input
                  type="text"
                  value={formData.nombreEmpresa}
                  onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Descripción de la empresa"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Sitio web</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="https://empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Logo de la empresa</label>
                <div className="mt-1 flex items-center gap-4">
                  {formData.logoUrl && (
                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-border">
                      <img src={formData.logoUrl} alt="Logo preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    {formData.logo ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.logo && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Archivo seleccionado: {formData.logo.name}
                  </p>
                )}
              </div>
            </form>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (editingCompany ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}