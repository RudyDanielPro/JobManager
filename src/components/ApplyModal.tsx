// components/ApplyModal.tsx
import { useState, useRef } from "react";
import { X, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export interface ApplyModalProps {
  jobTitle: string;
  companyName: string;
  onClose: () => void;
  onSubmit: (coverLetter: string, file: File) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ApplyModal({ 
  jobTitle, 
  companyName, 
  onClose, 
  onSubmit,
  isSubmitting: externalSubmitting = false 
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = externalSubmitting || internalSubmitting;

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError("Formato no válido. Solo se permiten PDF, DOC o DOCX");
      return false;
    }

    if (file.size > maxSize) {
      setError("El archivo no puede superar los 5MB");
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName("");
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);

    if (!coverLetter.trim()) {
      setError("Por favor, escribe una carta de presentación");
      toast.error("La carta de presentación es obligatoria");
      return;
    }

    if (!selectedFile) {
      setError("Por favor, adjunta tu CV");
      toast.error("El CV es obligatorio");
      return;
    }

    if (coverLetter.trim().length < 20) {
      setError("La carta de presentación debe tener al menos 20 caracteres");
      toast.error("Por favor, escribe un mensaje más detallado");
      return;
    }

    setInternalSubmitting(true);
    try {
      await onSubmit(coverLetter, selectedFile);
    } catch (err) {
      console.error("Error en submit:", err);
      setInternalSubmitting(false);
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-8 w-8 text-muted-foreground" />;
    
    if (selectedFile.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (selectedFile.type.includes('word')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-success" />;
  };

  const getFileTypeLabel = () => {
    if (!selectedFile) return "";
    if (selectedFile.type === 'application/pdf') return "PDF";
    if (selectedFile.type.includes('word')) return "DOC";
    return selectedFile.name.split('.').pop()?.toUpperCase() || "";
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-lg animate-fade-in rounded-2xl border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-card p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Aplicar a {jobTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{companyName}</p>
          </div>
          <button 
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            disabled={isSubmitting}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Carta de presentación <span className="text-destructive">*</span>
              </label>
              <span className={`text-xs ${coverLetter.length < 20 ? 'text-muted-foreground' : 'text-success'}`}>
                {coverLetter.length} / 20 caracteres mínimo
              </span>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => {
                setCoverLetter(e.target.value);
                setError(null);
              }}
              placeholder="Cuéntanos por qué eres el candidato ideal para este puesto. Destaca tu experiencia, habilidades y motivación..."
              disabled={isSubmitting}
              className="h-36 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Curriculum Vitae <span className="text-destructive">*</span>
            </label>
            
            {selectedFile ? (
              <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-3">
                  {getFileIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{getFileTypeLabel()}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className={`rounded-full p-3 transition-colors ${
                  isDragging ? "bg-primary/10" : "bg-muted"
                }`}>
                  <Upload className={`h-6 w-6 transition-colors ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {isDragging ? "Suelta el archivo aquí" : "Arrastra tu CV o haz clic para seleccionar"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC o DOCX (máx. 5MB)
                  </p>
                </div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Al enviar tu aplicación, aceptas que tus datos sean compartidos con {companyName} para el proceso de selección.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card p-5">
          <div className="flex gap-3">
            <button 
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !coverLetter.trim() || !selectedFile}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar aplicación"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}