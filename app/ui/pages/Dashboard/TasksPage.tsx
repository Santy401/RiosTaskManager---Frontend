"use client"

import { useEffect, useState, useRef, useCallback, JSX } from "react"
import { Avatar, AvatarFallback } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { ChevronLeft, ChevronRight, Calendar, User, Building2, MapPin, Loader2 } from "lucide-react"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { CreateTaskForm } from "../../components/ModalComponents/createTask"
import { useTask } from "@/app/presentation/hooks/Task/useTask"
import { ContextMenu } from '@/app/ui/components/ListsComponents/ActionsMenu/ContextMenu'

// Interface para Task con todas las propiedades necesarias
interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pendiente' | 'en_progreso' | 'terminada';
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: string;
    name: string;
  };
  area: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  itemId: string | null;
  taskId?: string | null;
  itemName: string;
  taskName?: string;
}

// Interface para los datos del formulario
interface CreateTaskFormData {
  name: string;
  description: string;
  status: string;
  dueDate: Date;
  companyId: string;
  areaId: string;
  userId: string;
}

export function TasksPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
    itemName: ""
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const [lastTap, setLastTap] = useState(0)
  const itemsPerPage = 10

  const { getAllTasks, isLoading, createTask, deleteTask, updateTask, isDeletingTask } = useTask();

  // Función para cargar tareas con casting de tipo
  const fetchTasks = useCallback(async (): Promise<Task[]> => {
    try {
      const taskData = await getAllTasks();
      // Casting para asegurar el tipo correcto
      return taskData as unknown as Task[];
    } catch (error) {
      console.log(error)
      return [];
    }
  }, [getAllTasks])

  // useEffect para carga inicial
  useEffect(() => {
    let isMounted = true;

    const loadData = async (): Promise<void> => {
      const taskData = await fetchTasks();
      if (isMounted) {
        setTasks(taskData);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchTasks]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (): void => {
      if (contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }))
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [contextMenu.visible])

  // Función para recargar tareas manualmente
  const loadTasks = useCallback(async (): Promise<void> => {
    const taskData = await fetchTasks();
    setTasks(taskData);
  }, [fetchTasks]);

  // Manejar click derecho
  const handleContextMenu = (event: React.MouseEvent, task: Task): void => {
    event.preventDefault()
    openContextMenu(event, task)
  }

  // Abrir menú contextual
  const openContextMenu = (event: React.MouseEvent, task: Task): void => {
    try {
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        itemId: task.id,
        itemName: task.name
      })
    } catch {
      setContextMenu({
        visible: true,
        x: 100,
        y: 100,
        itemId: task.id,
        itemName: task.name
      })
    }
  }

  // Acciones del menú contextual
  const handleMenuAction = async (action: string, itemId: string, itemName: string): Promise<void> => {
    try {
      switch (action) {
        case 'view':
          alert(`Ver detalles de: ${itemName}`)
          break

        case 'edit':
          const taskToEdit = tasks.find(task => task.id === itemId)
          if (taskToEdit) {
            setEditingTask(taskToEdit)
            setIsEditMode(true)
            setIsModalOpen(true)
          }
          break

        case 'delete':
          if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${itemName}"?`)) {
            await deleteTask(itemId)
            await loadTasks()
          }
          break
      }
    } catch {
      // Error silencioso
    }
  }

  const closeContextMenu = (): void => {
    setContextMenu(prev => ({ ...prev, visible: false }))
  }

  const handleDoubleClick = (event: React.MouseEvent, task: Task): void => {
    openContextMenu(event, task)
  }

  const handleDoubleTap = (event: React.MouseEvent | React.TouchEvent, task: Task): void => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap

    if (tapLength < 300 && tapLength > 0) {
      if ('touches' in event) {
        const touch = event.touches[0]
        const syntheticEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => { }
        } as React.MouseEvent
        openContextMenu(syntheticEvent, task)
      } else {
        openContextMenu(event as React.MouseEvent, task)
      }
    }
    setLastTap(currentTime)
  }

  // Filtrar tareas basado en búsqueda y filtros
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(task =>
    filterStatus === "all" || task.status === filterStatus
  )

  // Verificar si hay tareas para mostrar
  const hasTasks = filteredTasks.length > 0

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string): { variant: "default" | "secondary"; className: string } => {
    switch (status) {
      case 'terminada':
        return { variant: "default" as const, className: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer" }
      case 'en_progreso':
        return { variant: "default" as const, className: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer" }
      case 'pendiente':
        return { variant: "secondary" as const, className: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 cursor-pointer" }
      default:
        return { variant: "secondary" as const, className: "" }
    }
  }

  // Función para formatear fecha
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Verificar si la tarea está vencida
  const isOverdue = (dueDate: Date): boolean => {
    return new Date(dueDate) < new Date()
  }

  const handleCreateTask = async (taskData: CreateTaskFormData): Promise<void> => {
    try {
      if (isEditMode && editingTask) {
        await updateTask({ taskId: editingTask.id, data: taskData })
      } else {
        await createTask(taskData)
      }
    } catch {
      throw new Error('Error en operación tarea')
    }
  }

  const handleCreateSuccess = (): void => {
    setIsModalOpen(false)
    setEditingTask(null)
    setIsEditMode(false)
    loadTasks()
  }

  const handleAddTaskClick = (): void => {
    setEditingTask(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const contextMenuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Tareas</h1>
        <p className="text-sm text-muted-foreground">
          {filteredTasks.length} tareas registradas
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Input
            placeholder="Buscar tarea, descripción, empresa, área o responsable"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-secondary/50 border-border text-white"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border text-white">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="terminada">Terminada</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch className="data-[state=checked]:bg-emerald-500" />
            <span className="text-sm text-foreground">Mostrar solo activas</span>
          </div>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleAddTaskClick}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Agregar Tarea"}
        </Button>
      </div>

      {/* Table */}
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
              filteredTasks.map((task) => {
                const isDeleting = isDeletingTask(task.id);

                return (
                  <TableRow
                    key={task.id}
                    className={`border-border hover:bg-secondary/30 transition-colors duration-200 ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    onContextMenu={(e) => !isDeleting && handleContextMenu(e, task)}
                    onDoubleClick={(e) => !isDeleting && handleDoubleClick(e, task)}
                    onClick={(e) => !isDeleting && handleDoubleTap(e, task)}
                    onTouchStart={(e) => !isDeleting && handleDoubleTap(e, task)}
                    style={{ cursor: 'context-menu' }}
                  >
                    <TableCell className="font-medium">
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          <span className="text-muted-foreground">Eliminando...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{task.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-md">
                      {isDeleting ? (
                        <div className="line-clamp-2 text-muted-foreground">-</div>
                      ) : (
                        <div className="line-clamp-2">{task.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isDeleting ? (
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
                          <span className="text-sm text-[#7a7a7a]">{task.company.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isDeleting ? (
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
                          <span className="text-sm text-[#7a7a7a]">{task.area.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isDeleting ? (
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
                            <span className="text-sm text-[#858585]">{task.user.name || 'Sin asignar'}</span>
                            <span className="text-xs text-muted-foreground">{task.user.email}</span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isDeleting ? (
                        <div className="h-6 flex items-center">
                          <span className="text-xs text-muted-foreground">-</span>
                        </div>
                      ) : (
                        <Badge {...getStatusBadgeVariant(task.status)}>
                          {task.status === 'terminada' ? 'Terminada' :
                            task.status === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isDeleting ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>-</span>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) && task.status !== 'terminada' ? 'text-red-400' : 'text-muted-foreground'}`}>
                          <Calendar className="h-4 w-4" />
                          <span className={isOverdue(task.dueDate) && task.status !== 'terminada' ? 'font-semibold' : ''}>
                            {formatDate(task.dueDate)}
                          </span>
                          {isOverdue(task.dueDate) && task.status !== 'terminada' && (
                            <Badge variant="destructive" className="text-xs">
                              Vencida
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {isDeleting ? '-' : formatDate(task.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron tareas</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleAddTaskClick}
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
          onAction={handleMenuAction}
          onClose={closeContextMenu}
          menuRef={contextMenuRef}
          isDeleting={isDeletingTask}
        />
      </div>

      {/* Estados de carga */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-foreground">Cargando tareas...</div>
        </div>
      )}

      {/* Pagination - Solo se muestra si hay tareas */}
      {hasTasks && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select defaultValue="10">
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
              Mostrando {Math.min(filteredTasks.length, itemsPerPage)} de {filteredTasks.length} tareas
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? "" : "text-white"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <span className="px-2 text-muted-foreground">...</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
              {Math.ceil(filteredTasks.length / itemsPerPage)}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(filteredTasks.length / itemsPerPage)}
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}

      {/* Slide-in Modal */}
      <SlideModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
          setIsEditMode(false)
        }}
        title={isEditMode ? "Editar tarea" : "Crear nueva tarea"}
      >
        <CreateTaskForm
          onSubmit={handleCreateTask}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingTask(null)
            setIsEditMode(false)
          }}
          onSuccess={handleCreateSuccess}
          editingTask={editingTask}
        />
      </SlideModal>
    </div>
  )
}