import { Edit, Trash2, Eye } from "lucide-react"
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
}

export function ContextMenu({ 
  visible, 
  x, 
  y, 
  itemId, 
  itemName, 
  onAction, 
  onClose,
  customActions ,
  menuRef
}: ContextMenuProps) {
  if (!visible || !itemId) return null

  const defaultActions = [
    { label: "Ver detalles", icon: <Eye className="h-4 w-4 text-blue-400" />, action: "view" },
    { label: "Editar", icon: <Edit className="h-4 w-4 text-green-400" />, action: "edit" },
    { label: "Eliminar", icon: <Trash2 className="h-4 w-4 text-red-500" />, action: "delete" }
  ]

  const actions = customActions || defaultActions

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
      
      {actions.map((action) => (
        <button
          key={action.action}
          onClick={() => onAction(action.action, itemId, itemName)}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}