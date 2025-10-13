import { useUser } from "@/app/presentation/hooks/User/useUser";

// ✅ Define un interface para las props
interface UserActionsMenuProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onUserDeleted: () => void; // ✅ Agregar esta prop
}

export default function UserActionsMenu({ 
  userId, 
  isOpen, 
  onClose, 
  position,
  onUserDeleted // ✅ Ahora está reconocida
}: UserActionsMenuProps) { // ✅ Usar el interface

  const { deleteUser, isLoading } = useUser();
  
  if (!isOpen) return null;

  const handleAction = async (action: string) => {
    console.log(`Acción: ${action} para usuario ${userId}`);
    
    try {
      switch (action) {
        case 'edit':
          // Lógica para editar usuario
          break;
        case 'ban':
          // Lógica para banear usuario
          break;
        case 'delete':
          if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
            await deleteUser(userId);
            onUserDeleted(); // ✅ Ahora funciona
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
          >
            Ver detalles
          </button>
          <button
            onClick={() => handleAction('edit')}
            className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
          >
            Editar usuario
          </button>
          {/* <button
            onClick={() => handleAction('ban')}
            className="flex w-full items-center px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
          >
            {users.find(u => u.id === userId)?.banned ? 'Desbanear' : 'Banear'}
          </button> */}
          <button
            onClick={() => handleAction('delete')}
            className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
          >
             {isLoading ? '⏳ Eliminando...' : '🗑️ Eliminar usuario'}
          </button>
        </div>
      </>
    );
  };