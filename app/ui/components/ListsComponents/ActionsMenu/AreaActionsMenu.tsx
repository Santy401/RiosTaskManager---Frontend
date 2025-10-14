import { useArea } from "@/app/presentation/hooks/Area/useArea";

// ✅ Interface para las props
interface CompanyActionsMenuProps {
  areaId: string;
  isOpen: boolean;
  onClose: () => void;
  onAreaDeleted: () => void; // ✅ Renombrar para evitar conflicto
}

export default function AreaActionsMenu({ 
  areaId, 
  isOpen, 
  onClose,
  onAreaDeleted // ✅ Nombre diferente
}: CompanyActionsMenuProps) {

  const { deleteArea, isLoading } = useArea(); // ✅ isLoading agregada
  
  if (!isOpen) return null;

  const handleAction = async (action: string) => {
    console.log(`Acción: ${action} para empresa ${areaId}`);
    
    try {
      switch (action) {
        case 'edit':
          // Lógica para editar empresa
          break;
        case 'ban':
          // Lógica para banear empresa
          break;
        case 'delete':
          if (confirm('¿Estás seguro de que quieres eliminar esta empresa? Esta acción no se puede deshacer.')) {
            await deleteArea(areaId); // ✅ deleteCompany, no deleteUser
            onAreaDeleted(); // ✅ Nombre actualizado
          }
          break;
        case 'view':
          // Lógica para ver detalles
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
      {/* Fondo semitransparente para cerrar al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menú flotante */}
      <div 
        className="absolute z-50 w-48 rounded-md border border-border bg-card shadow-lg py-1"
        style={{right: '38%', top: '10%'}}
      >
        <button
          onClick={() => handleAction('view')}
          className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
          disabled={isLoading} // ✅ Deshabilitar durante loading
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
          disabled={isLoading} // ✅ Deshabilitar durante eliminación
          className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Eliminando...' : '🗑️ Eliminar Area'} {/* ✅ isLoading funciona */}
        </button>
      </div>
    </>
  );
};