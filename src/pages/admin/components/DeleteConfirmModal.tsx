import { AlertCircle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="rounded-xl bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="rounded p-1 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-muted-foreground">{message}</p>
            <p className="mt-2 font-medium text-foreground">"{itemName}"</p>
            <p className="mt-2 text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
          </div>
          
          <div className="flex justify-end gap-3 border-t border-border p-4">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}