import { Edit, Trash2, Eye, Loader2, Copy } from "lucide-react";
import { RefObject } from "react";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  itemId: string | null;
  itemName: string;
  onAction: (action: string, itemId: string, itemName: string) => void;
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement | null>; 
  customActions?: { label: string; icon: React.ReactNode; action: string }[];
  isDeleting?: (itemId: string) => boolean;
  isDuplicating?: (itemId: string) => boolean;
}

export function ContextMenu({ 
  visible, 
  x, 
  y, 
  itemId, 
  itemName, 
  onAction, 
  onClose,
  customActions,
  menuRef,
  isDeleting,
  isDuplicating
}: ContextMenuProps) {
  if (!visible || !itemId) return null

  const defaultActions = [
    { label: "Ver detalles", icon: <Eye className="h-4 w-4 text-blue-400" />, action: "view" },
    { label: "Editar", icon: <Edit className="h-4 w-4 text-green-400" />, action: "edit" },
    { label: "Duplicar", icon: <Copy className="h-4 w-4 text-amber-400" />, action: "duplicate" },
    { label: "Eliminar", icon: <Trash2 className="h-4 w-4 text-red-500" />, action: "delete" }
  ]

  const actions = customActions || defaultActions

  const handleAction = async (action: string, itemId: string, itemName: string) => {
    // Cerrar el menú inmediatamente para cualquier acción
    onClose();
    
    // Ejecutar la acción después de cerrar el menú
    await onAction(action, itemId, itemName);
  }

  return (
    <div 
      className="fixed z-50 w-56 rounded-lg border border-border bg-card shadow-lg py-2 animate-in fade-in-0 zoom-in-95"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-1.5 border-b border-border">
        <p className="text-sm font-medium text-foreground truncate">
          {itemName}
        </p>
        <p className="text-xs text-muted-foreground">ID: {itemId.slice(0, 8)}...</p>
      </div>
      
      {actions.map((action) => {
        const isDeletingThisItem = isDeleting && action.action === 'delete' ? isDeleting(itemId) : false;
        const isDuplicatingThisItem = isDuplicating && action.action === 'duplicate' ? isDuplicating(itemId) : false;
        const isLoading = isDeletingThisItem || isDuplicatingThisItem;
        
        return (
          <button
            key={action.action}
            onClick={() => handleAction(action.action, itemId, itemName)}
            disabled={isLoading}
            className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors ${
              action.action === 'delete' 
                ? isDeletingThisItem 
                  ? 'text-muted-foreground cursor-not-allowed' 
                  : 'text-red-500 hover:bg-red-500/10'
                : action.action === 'duplicate'
                ? isDuplicatingThisItem
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-amber-500 hover:bg-amber-500/10'
                : 'text-foreground hover:bg-secondary/50'
            }`}
          >
            {isDeletingThisItem ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : isDuplicatingThisItem ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Duplicando...</span>
              </>
            ) : (
              <>
                {action.icon}
                <span>{action.label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  )
}