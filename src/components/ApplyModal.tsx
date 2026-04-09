import { useState, useRef } from "react";
import { X, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Cancel } from "@radix-ui/react-alert-dialog";

interface ApplyModalProps {
  jobTitle: string;
  companyName: string;
  onClose: () => void;
  onSubmit: (coverLetter: string, file: File) => void; 
}

export default function ApplyModal({ jobTitle, companyName, onClose, onSubmit }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (coverLetter.trim() && selectedFile) {
      onSubmit(coverLetter, selectedFile);
    } else {
      toast.error("Por favor adjunta tu CV y escribe un mensaje");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg animate-fade-in rounded-2xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Aplicar a {jobTitle}</h2>
            <p className="text-sm text-muted-foreground">{companyName}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Carta de presentación</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Cuéntanos por qué eres el candidato ideal..."
              className="h-32 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Curriculum Vitae</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : fileName
                  ? "border-success/50 bg-success/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {fileName ? (
                <>
                  <FileText className="h-8 w-8 text-success" />
                  <p className="text-sm font-medium text-foreground">{fileName}</p>
                  <p className="text-xs text-muted-foreground">Haz clic para cambiar</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra tu CV aquí o <span className="font-medium text-primary">selecciona un archivo</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOC o DOCX (máx. 5MB)</p>
                </>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
            <Cancel /> Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!coverLetter.trim() || !selectedFile}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar aplicación
          </button>
        </div>
      </div>
    </div>
  );
}