import { useState } from "react";

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

interface CreateTaskData {
  name: string;
  description: string;
  dueDate: Date;
  status: 'pendiente' | 'en_progreso' | 'terminada';
  companyId: string;
  areaId: string;
  userId: string;
}

interface UpdateTaskData {
  name?: string;
  description?: string;
  dueDate?: Date;
  status?: 'pendiente' | 'en_progreso' | 'terminada';
  companyId?: string;
  areaId?: string;
  userId?: string;
}

interface UseTaskResult {
  getAllTasks: () => Promise<Task[]>;
  getTaskById: (taskId: string) => Promise<Task>;
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (taskId: string, data: UpdateTaskData) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export const useTask = (): UseTaskResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllTasks = async (): Promise<Task[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [HOOK] Obteniendo tareas...');
      
      const response = await fetch('/api/admin/tasks', {
        method: 'GET',
        credentials: 'include',
      });

      console.log('📥 [HOOK] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error al obtener tareas';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || `Error ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const tasks = await response.json();
      console.log('✅ [HOOK] Tareas obtenidas:', tasks);
      
      return tasks;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en getAllTasks:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const getTaskById = async (taskId: string): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [HOOK] Obteniendo tarea:', taskId);
      
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log('📥 [HOOK] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error al obtener la tarea';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || `Error ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const task = await response.json();
      console.log('✅ [HOOK] Tarea obtenida:', task);
      
      return task;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en getTaskById:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const createTask = async (data: CreateTaskData): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [HOOK] Creando tarea...', data);
      
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log('📥 [HOOK] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error al crear tarea';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || `Error ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const newTask = await response.json();
      console.log('✅ [HOOK] Tarea creada:', newTask);
      
      return newTask;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en createTask:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const updateTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [HOOK] Actualizando tarea:', taskId, data);
      
      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log('📥 [HOOK] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error al actualizar tarea';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || `Error ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const updatedTask = await response.json();
      console.log('✅ [HOOK] Tarea actualizada:', updatedTask);
      
      return updatedTask;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en updateTask:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const deleteTask = async (taskId: string): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🗑️ [HOOK] Eliminando tarea:', taskId);

      const response = await fetch(`/api/admin/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      console.log('📥 [HOOK] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar tarea');
      }

      const result = await response.json();
      console.log('✅ [HOOK] Tarea eliminada exitosamente:', result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('💥 [HOOK] Error en deleteTask:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { 
    getAllTasks, 
    getTaskById,
    createTask, 
    updateTask,
    deleteTask,
    isLoading, 
    error 
  };
}