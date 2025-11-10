import { Avatar, AvatarFallback } from "@/app/ui/components/StyledComponents/avatar"
import { TableCell, TableRow } from "@/app/ui/components/StyledComponents/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Calendar, User, Building2, MapPin, Loader2 } from "lucide-react"
import type { Task } from "@/app/presentation/hooks/Task/type"

interface TaskTableRowProps {
  task: Task
  isDeleting: boolean
  isDuplicating: boolean
  onContextMenu: (e: React.MouseEvent, task: Task) => void
  onDoubleClick: (e: React.MouseEvent, task: Task) => void
  onDoubleTap: (e: React.MouseEvent | React.TouchEvent, task: Task) => void
  onStatusChange: (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'terminada') => Promise<void>
}

export function TaskTableRow({
  task,
  isDeleting,
  isDuplicating,
  onContextMenu,
  onDoubleClick,
  onDoubleTap,
  onStatusChange
}: TaskTableRowProps) {
  const isProcessing = isDeleting || isDuplicating

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isOverdue = (dueDate: Date): boolean => {
    return new Date(dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
  }

  return (
    <TableRow
      key={task.id}
      className={`border-border hover:bg-secondary/30 transition-colors duration-200 ${
        isProcessing ? 'opacity-50 pointer-events-none' : ''
      }`}
      onContextMenu={(e) => !isProcessing && onContextMenu(e, task)}
      onDoubleClick={(e) => !isProcessing && onDoubleClick(e, task)}
      onClick={(e) => !isProcessing && onDoubleTap(e, task)}
      onTouchStart={(e) => !isProcessing && onDoubleTap(e, task)}
      style={{ cursor: 'context-menu' }}
    >
      {/* Nombre de la tarea */}
      <TableCell className="font-medium">
        {isDeleting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-muted-foreground">Eliminando...</span>
          </div>
        ) : isDuplicating ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span className="text-muted-foreground">Duplicando...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{task.name}</span>
          </div>
        )}
      </TableCell>

      {/* Descripción */}
      <TableCell className="text-muted-foreground max-w-md">
        {isProcessing ? (
          <div className="line-clamp-2 text-muted-foreground">-</div>
        ) : (
          <div className="line-clamp-2">{task.description}</div>
        )}
      </TableCell>

      {/* Empresa */}
      <TableCell>
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
            </div>
            <span className="text-sm text-muted-foreground">-</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                <Building2 className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-[#7a7a7a]">{task.company?.name || 'Sin empresa'}</span>
          </div>
        )}
      </TableCell>

      {/* Área */}
      <TableCell>
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Loader2 className="h-3 w-3 animate-spin text-green-400" />
            </div>
            <span className="text-sm text-muted-foreground">-</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                <MapPin className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-[#7a7a7a]">{task.area?.name || 'Sin área'}</span>
          </div>
        )}
      </TableCell>

      {/* Responsable */}
      <TableCell>
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">-</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm text-[#858585]">{task.user?.name || 'Sin asignar'}</span>
              <span className="text-xs text-muted-foreground">{task.user?.email || ''}</span>
            </div>
          </div>
        )}
      </TableCell>

      {/* Estado */}
      <TableCell onClick={(e) => e.stopPropagation()}>
        {isProcessing ? (
          <div className="h-6 flex items-center">
            <span className="text-xs text-muted-foreground">-</span>
          </div>
        ) : (
          <Select
            value={task.status}
            onValueChange={(value) => onStatusChange(task.id, value as 'pendiente' | 'en_progreso' | 'terminada')}
          >
            <SelectTrigger 
              className={`w-[140px] h-8 border-0 ${
                task.status === 'terminada' 
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                  : task.status === 'en_progreso'
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
              }`}
            >
              <SelectValue>
                {task.status === 'terminada' ? 'Terminada' :
                  task.status === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="terminada">Terminada</SelectItem>
            </SelectContent>
          </Select>
        )}
      </TableCell>

      {/* Fecha de vencimiento */}
      <TableCell>
        {isProcessing ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>-</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className={isOverdue(task.dueDate) && task.status !== 'terminada' ? 'font-semibold' : ''}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </TableCell>

      {/* Fecha de creación */}
      <TableCell className="text-muted-foreground">
        {isProcessing ? '-' : formatDate(task.createdAt)}
      </TableCell>
    </TableRow>
  )
}
