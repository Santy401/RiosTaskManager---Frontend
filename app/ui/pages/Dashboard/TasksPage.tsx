"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/app/ui/components/StyledComponents/button"
import { SlideModal } from "../../components/ModalComponents/slideModal"
import { CreateTaskForm } from "../../components/ModalComponents/createTask"

import { useTask } from "@/app/presentation/hooks/Task/useTask"
import { useTaskFilters } from "@/app/presentation/hooks/Task/hooks/useTaskFilters"
import { useTaskPagination } from "@/app/presentation/hooks/Task/hooks/useTaskPagination"
import { useTaskActions } from "@/app/presentation/hooks/Task/useTaskActions"
import { useContextMenu } from "@/app/presentation/hooks/Task/hooks/useContextMenu"

import { TaskHeader } from "../../components/TaskComponents/TaskHeader"
import { TaskFilters } from "../../components/TaskComponents/TaskFilters"
import { TaskTable } from "../../components/TaskComponents/TaskTable"

import type { Task } from "@/app/presentation/hooks/Task/type"

import { ToastContainer, toast } from "react-toastify"

interface CreateTaskFormData {
  name: string
  description: string
  status: string
  dueDate: Date
  companyId: string
  areaId: string
  userId: string
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const { getAllTasks, isLoading, createTask, updateTask } = useTask()

  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    showOnlyActive,
    setShowOnlyActive,
    sortBy,
    setSortBy,
    filteredTasks
  } = useTaskFilters(tasks)

  const paginationProps = useTaskPagination(filteredTasks, 10)

  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu()

  const fetchTasks = useCallback(async (showLoading = false): Promise<Task[]> => {
    if (showLoading) setIsRefreshing(true)
    setLoadError(null)

    try {
      console.log('🔍 Iniciando carga de tareas...')
      const taskData = await getAllTasks()
      console.log('✅ Tareas cargadas:', taskData)

      if (!Array.isArray(taskData)) {
        console.error('❌ Los datos recibidos no son un array:', taskData)
        throw new Error('Formato de datos inválido del servidor')
      }

      const mappedTasks = taskData.map((task): Task => ({
        id: task.id || '',
        name: task.name || 'Sin nombre',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        status: task.status as "pendiente" | "en_progreso" | "terminada",
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
        company: {
          id: task.company?.id || '',
          name: task.company?.name || 'Sin empresa',
        },
        area: {
          id: task.area?.id || '',
          name: task.area?.name || 'Sin área',
        },
        user: {
          id: task.user?.id || '',
          name: task.user?.name || 'Sin asignar',
          email: task.user?.email || '',
        },
      }))

      return mappedTasks
    } catch (error) {
      console.error('❌ Error cargando tareas:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar tareas'
      setLoadError(errorMessage)
      return []
    } finally {
      if (showLoading) setIsRefreshing(false)
      setInitialLoad(false)
    }
  }, [getAllTasks])

  const loadTasks = useCallback(async (): Promise<void> => {
    const taskData = await fetchTasks(true)
    setTasks(taskData)
  }, [fetchTasks])

  const actionHandlers = useTaskActions(loadTasks)

  const hasFetched = useRef(false)
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const loadData = async (): Promise<void> => {
      const taskData = await fetchTasks()
      setTasks(taskData)
    }

    void loadData()
  }, [fetchTasks])

  const handleMenuAction = async (action: string, itemId: string, itemName: string): Promise<void> => {
    try {
      switch (action) {
        case 'view':
          alert(`Ver detalles de: ${itemName}`)
          break

        case 'edit': {
          const taskToEdit = tasks.find(task => task.id === itemId)
          if (taskToEdit) {
            setEditingTask(taskToEdit)
            setIsEditMode(true)
            setIsModalOpen(true)
          }
          break
        }

        case 'delete':
          await actionHandlers.deleteTask(itemId)
          toast.success('Tarea eliminada exitosamente')
          break

        case 'duplicate': {
          const taskToDuplicate = tasks.find(task => task.id === itemId)
          if (taskToDuplicate) {
            await actionHandlers.duplicateTask(taskToDuplicate)
            toast.success('Tarea duplicada exitosamente')
          }
          break
        }

        default:
          break
      }
    } catch (error) {
      console.error('Error en acción del menú:', error)
      toast.error('Error al realizar la acción')
    }
  }

  const handleContextMenu = (event: React.MouseEvent, task: Task): void => {
    event.preventDefault()
    openContextMenu(event, task.id, task.name)
  }

  const handleCreateTask = async (taskData: CreateTaskFormData): Promise<void> => {
    try {
      if (isEditMode && editingTask) {
        await updateTask({ taskId: editingTask.id, data: taskData })
      } else {
        await createTask(taskData)
      }
    } catch (error) {
      console.error('Error al guardar tarea:', error)
      throw new Error('Error en operación tarea')
    }
  }

  const handleCreateSuccess = (): void => {
    setIsModalOpen(false)
    setEditingTask(null)
    setIsEditMode(false)
    void loadTasks()
    toast.success('Tarea creada exitosamente')
  }

  const handleAddTaskClick = (): void => {
    setEditingTask(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'terminada'): Promise<void> => {
    try {
      await updateTask({
        taskId,
        data: { status: newStatus }
      })
      await loadTasks()
      toast.success('Estado de tarea actualizado exitosamente')
    } catch (error) {
      console.error('Error al actualizar estado de tarea:', error)
      toast.error('Error al actualizar estado de tarea')
    }
  }

  if (initialLoad) {
    return (
      <div className="w-full p-6 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-foreground">Cargando tareas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
    <ToastContainer position="bottom-right" theme="dark"/>
    <div className="w-full p-6 space-y-6">
      <TaskHeader
        taskCount={filteredTasks.length}
        onRefresh={loadTasks}
        isLoading={isLoading || isRefreshing}
      />

      {loadError && (
        <div className="bg-destructive/15 border border-destructive/50 text-destructive-foreground p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-medium">Error al cargar tareas</p>
            <p className="text-sm opacity-90">{loadError}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadTasks}>
            Reintentar
          </Button>
        </div>
      )}

      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showOnlyActive={showOnlyActive}
        setShowOnlyActive={setShowOnlyActive}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isLoading={isLoading || isRefreshing}
        onAddTask={handleAddTaskClick}
      />

      <TaskTable
        tasks={paginationProps.paginatedItems}
        contextMenu={contextMenu}
        onContextMenu={handleContextMenu}
        onMenuAction={handleMenuAction}
        onCloseContextMenu={closeContextMenu}
        actionHandlers={actionHandlers}
        pagination={paginationProps}
        onAddTask={handleAddTaskClick}
        onStatusChange={handleStatusChange}
      />

      {(isLoading || isRefreshing) && !initialLoad && (
        <div className="flex justify-center items-center p-4">
          <div className="flex items-center gap-3 text-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>{isRefreshing ? 'Actualizando tareas...' : 'Cargando tareas...'}</span>
          </div>
        </div>
      )}

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
    </>
  )
}
