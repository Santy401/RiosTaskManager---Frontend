"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/components/StyledComponents/avatar"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { Input } from "@/app/ui/components/StyledComponents/input"
import { Badge } from "@/app/ui/components/StyledComponents/badge"
import { Switch } from "@/app/ui/components/StyledComponents/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/ui/components/StyledComponents/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/ui/components/StyledComponents/table"
import { CheckCircle2, XCircle, Circle, ChevronLeft, ChevronRight, Calendar, User, Building2, MapPin, EllipsisVertical } from "lucide-react"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { CreateTaskForm } from "../../components/ModalComponents/createTask"
import { useTask } from "@/app/presentation/hooks/Task/useTask"
// import TaskActionsMenu from "./ActionsMenu/TaskActionsMenu"

interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pendiente' | 'en_progreso' | 'terminada';
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
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

export function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const itemsPerPage = 10

  const { getAllTasks, isLoading, createTask, deleteTask } = useTask();

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      console.log('🔄 [COMPONENT] Cargando tareas...');
      const taskData = await getAllTasks();
      console.log('✅ [COMPONENT] Tareas cargadas:', taskData);
      setTasks(taskData)
    } catch (error) {
      console.error('❌ [COMPONENT] Error al cargar tareas:', error)
    }
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

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
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
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Verificar si la tarea está vencida
  const isOverdue = (dueDate: Date) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Tareas</h1>
        <p className="text-sm text-muted-foreground">{filteredTasks.length} tareas registradas</p>
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
          onClick={() => setIsModalOpen(true)}
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
              <TableHead className="text-muted-foreground font-medium">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id} className="border-border hover:bg-secondary/30">
                <TableCell className="font-medium text-foreground">
                  <div className="flex flex-col">
                    <span className="font-semibold">{task.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-md">
                  <div className="line-clamp-2">{task.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                        <Building2 className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-[#7a7a7a]">{task.company.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-green-500/20 text-green-400 text-xs">
                        <MapPin className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm  text-[#7a7a7a]">{task.area.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm  text-[#7a7a7a]">{task.user.name || 'Sin asignar'}</span>
                      <span className="text-xs text-muted-foreground">{task.user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge {...getStatusBadgeVariant(task.status)}>
                    {task.status === 'terminada' ? 'Terminada' : 
                     task.status === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(task.createdAt)}
                </TableCell>
                {/* <TableCell>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        const newOpenMenuId = openMenuId === task.id ? null : task.id;
                        setOpenMenuId(newOpenMenuId);
                      }}
                      className="p-1 rounded hover:bg-secondary/50 transition-colors"
                    >
                      <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {openMenuId === task.id && (
                      <TaskActionsMenu
                        taskId={task.id}
                        isOpen={true}
                        onClose={() => setOpenMenuId(null)}
                        onTaskDeleted={loadTasks}
                      />
                    )}
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-foreground">Cargando tareas...</div>
        </div>
      )}

      {filteredTasks.length === 0 && !isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron tareas</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              Crear primera tarea
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
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

      {/* Slide-in Modal */}
      <SlideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear nueva tarea">
        <CreateTaskForm onSubmit={createTask} onCancel={() => setIsModalOpen(false)} />
      </SlideModal>
    </div>
  )
}