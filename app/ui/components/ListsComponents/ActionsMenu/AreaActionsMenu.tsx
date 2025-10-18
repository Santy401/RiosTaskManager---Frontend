import { useArea } from "@/app/presentation/hooks/Area/useArea";

interface CompanyActionsMenuProps {
  areaId: string;
  isOpen: boolean;
  onClose: () => void;
  onAreaDeleted: () => void;
}

export default function AreaActionsMenu({ 
  areaId, 
  isOpen, 
  onClose,
  onAreaDeleted
}: CompanyActionsMenuProps) {

  const { deleteArea, isLoading } = useArea();
  
  if (!isOpen) return null;

  const handleAction = async (action: string) => {
    console.log(`Acción: ${action} para empresa ${areaId}`);
    
    try {
      switch (action) {
        case 'edit':
          break;
        case 'ban':
          break;
        case 'delete':
          if (confirm('¿Estás seguro de que quieres eliminar esta empresa? Esta acción no se puede deshacer.')) {
            await deleteArea(areaId);
            onAreaDeleted();
          }
          break;
        case 'view':
          break;
      }
    } catch (error) {
      console.error('Error en acción:', error);
    } finally {
      onClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      <div 
        className="absolute z-50 w-48 rounded-md border border-border bg-card shadow-lg py-1"
        style={{right: '38%', top: '10%'}}
      >
        <button
          onClick={() => handleAction('view')}
          className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
          disabled={isLoading}
        >
          👁️ Ver detalles
        </button>
        <button
          onClick={() => handleAction('edit')}
          className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
          disabled={isLoading}
        >
          ✏️ Editar empresa
        </button>
        <button
          onClick={() => handleAction('delete')}
          disabled={isLoading}
          className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Eliminando...' : '🗑️ Eliminar Area'}
        </button>
      </div>
    </>
  );
};