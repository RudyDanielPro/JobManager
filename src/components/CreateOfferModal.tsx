// components/CreateOfferModal.tsx
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ofertasService } from "@/lib/ofertasService";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOfferModal({ isOpen, onClose, onSuccess }: CreateOfferModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    ubicacion: "",
    rangoSalarial: "",
    descripcion: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.ubicacion || !formData.descripcion) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    setSubmitting(true);
    try {
      await ofertasService.crear({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        ubicacion: formData.ubicacion,
        rangoSalarial: formData.rangoSalarial || "No especificado",
      });
      toast.success("Oferta creada correctamente");
      setFormData({ titulo: "", ubicacion: "", rangoSalarial: "", descripcion: "" });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creando oferta:", error);
      toast.error(error.response?.data || "Error al crear la oferta");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Crear nueva oferta</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Título del puesto *</label>
            <input
              type="text"
              name="titulo"
              placeholder="Ej: Desarrollador Full Stack"
              value={formData.titulo}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ej: Remoto, Madrid, Barcelona"
              value={formData.ubicacion}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Rango salarial</label>
            <input
              type="text"
              name="rangoSalarial"
              placeholder="Ej: 35.000€ - 45.000€"
              value={formData.rangoSalarial}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descripción del puesto *</label>
            <textarea
              name="descripcion"
              placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
              value={formData.descripcion}
              onChange={handleChange}
              rows={6}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.descripcion.length} caracteres
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                  Publicando...
                </>
              ) : (
                "Publicar oferta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}