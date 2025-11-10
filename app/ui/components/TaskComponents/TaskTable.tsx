import { useRef } from "react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { TaskTableRow } from "./TaskTableRow"
import { ContextMenu } from '@/app/ui/components/ListsComponents/ActionsMenu/ContextMenu'
import type { Task } from "@/app/presentation/hooks/Task/type"

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  itemId: string | null
  itemName: string
}

interface PaginationProps {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  nextPage: () => void
  prevPage: () => void
}

interface ActionHandlers {
  isDeletingTask: (id: string) => boolean
  isItemDuplicating?: (id: string) => boolean
}

interface TaskTableProps {
  tasks: Task[]
  contextMenu: ContextMenuState
  onContextMenu: (e: React.MouseEvent, task: Task) => void
  onMenuAction: (action: string, itemId: string, itemName: string) => void
  onCloseContextMenu: () => void
  actionHandlers: ActionHandlers
  pagination: PaginationProps
  onAddTask: () => void
  onStatusChange: (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'terminada') => Promise<void>
}

export function TaskTable({
  tasks,
  contextMenu,
  onContextMenu,
  onMenuAction,
  onCloseContextMenu,
  actionHandlers,
  pagination,
  onAddTask,
  onStatusChange
}: TaskTableProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const hasTasks = tasks.length > 0

  const handleDoubleClick = (event: React.MouseEvent, task: Task): void => {
    onContextMenu(event, task)
  }

  const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent, task: Task): void => {
    if ('touches' in event) {
      const touch = event.touches[0]
      const syntheticEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => { }
      } as React.MouseEvent
      onContextMenu(syntheticEvent, task)
    } else {
      onContextMenu(event as React.MouseEvent, task)
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Tarea</TableHead>
              <TableHead className="text-muted-foreground font-medium">Descripción</TableHead>
              <TableHead className="text-muted-foreground font-medium">Empresa</TableHead>
              <TableHead className="text-muted-foreground font-medium">Área</TableHead>
              <TableHead className="text-muted-foreground font-medium">Responsable</TableHead>
              <TableHead className="text-muted-foreground font-medium">Estado</TableHead>
              <TableHead className="text-muted-foreground font-medium">Fecha Vencimiento</TableHead>
              <TableHead className="text-muted-foreground font-medium">Creada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasTasks ? (
              tasks.map((task) => (
                <TaskTableRow
                  key={task.id}
                  task={task}
                  isDeleting={actionHandlers.isDeletingTask(task.id)}
                  isDuplicating={false}
                  onContextMenu={onContextMenu}
                  onDoubleClick={handleDoubleClick}
                  onDoubleTap={handleDoubleTap}
                  onStatusChange={onStatusChange}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron tareas</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={onAddTask}
                    >
                      Crear primera tarea
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          itemId={contextMenu.itemId}
          itemName={contextMenu.itemName}
          onAction={onMenuAction}
          onClose={onCloseContextMenu}
          menuRef={contextMenuRef}
          isDeleting={actionHandlers.isDeletingTask}
        />
      </div>

      {/* Pagination */}
      {hasTasks && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select 
              value={pagination.itemsPerPage.toString()} 
              onValueChange={(value) => pagination.setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[70px] bg-secondary/50 border-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Mostrando {Math.min(tasks.length, pagination.itemsPerPage)} de {tasks.length} tareas
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={pagination.prevPage}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </Button>
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => (
              <Button
                key={i + 1}
                variant={pagination.currentPage === i + 1 ? "default" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${pagination.currentPage === i + 1 ? "" : "text-white"}`}
                onClick={() => pagination.setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            {pagination.totalPages > 5 && (
              <>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                  {pagination.totalPages}
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={pagination.nextPage}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
