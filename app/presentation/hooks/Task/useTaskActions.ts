import { useState } from 'react';
import { useTaskBase } from "./useTaskBase";
import { useLoading } from '@/app/presentation/hooks/useLoading';
import { useEntityActions } from '@/app/presentation/hooks/useEntityActions';
import { Task, CreateTaskData, UpdateTaskData, DeleteTaskResponse } from "./type";
import { toast } from "react-toastify";

interface UseTaskActionsResult {
    createTask: (data: CreateTaskData) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<DeleteTaskResponse>;
    updateTask: (params: { taskId: string; data: UpdateTaskData }) => Promise<Task>;
    submitTask: (data: CreateTaskData, editingTask?: Task | null) => Promise<Task>;
    duplicateTask: (task: Task) => Promise<Task>;
    isDeletingTask: (taskId: string) => boolean;
}

export const useTaskActions = (loadTasks?: () => Promise<void>): UseTaskActionsResult => {
    const { setLoading } = useTaskBase();
    const { addDeleting, removeDeleting, isDeleting } = useLoading();
    const { deleteEntity } = useEntityActions();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTask = async (data: CreateTaskData): Promise<Task> => {
        setLoading(true);
        setError(null);
        setIsLoading(true);

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
            toast.error('Error al crear tarea');
            throw err;
        } finally {
            setLoading(false);
            setIsLoading(false);
            if (!error) {
                toast.success('Tarea creada exitosamente');
            }
        }
    }

    const deleteTask = async (taskId: string): Promise<DeleteTaskResponse> => {
        addDeleting(taskId);
        setLoading(true);
        setError(null);
        setIsLoading(true);

        try {
            console.log('🗑️ [HOOK] Eliminando tarea:', taskId);

            const response = await fetch(`/api/admin/tasks/${taskId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            console.log('📥 [HOOK] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Error al eliminar la tarea';
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                    
                    // Check if this is a constraint error (related items exist)
                    if (response.status === 400 && errorData.code === 'P2003') {
                        toast.error('No se puede eliminar la tarea porque tiene elementos relacionados');
                        return { 
                            success: false, 
                            message: 'No se puede eliminar la tarea porque tiene elementos relacionados',
                            deletedTaskId: taskId 
                        };
                    }
                } catch {
                    errorMessage = errorText || `Error ${response.status}`;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('✅ [HOOK] Tarea eliminada exitosamente:', result);
            
            if (loadTasks) {
                console.log('🔄 [HOOK] Actualizando lista de tareas...');
                await loadTasks();
            }
            
            toast.success('Tarea eliminada exitosamente');
            return { 
                success: true, 
                message: 'Tarea eliminada exitosamente', 
                deletedTaskId: taskId 
            };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en deleteTask:', err);
            setError(errorMessage);
            toast.error('Error al eliminar la tarea');
            throw err;
        } finally {
            removeDeleting(taskId);
            setLoading(false);
            setIsLoading(false);
        }
    }

    const updateTask = async (params: { taskId: string; data: UpdateTaskData }): Promise<Task> => {
        setLoading(true);
        setError(null);
        setIsLoading(true);

        const { taskId, data } = params;

        try {
            console.log('🔄 [HOOK] Actualizando tarea...', { taskId, data });

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
            toast.error('Error al actualizar tarea');
            throw err;
        } finally {
            setLoading(false);
            setIsLoading(false);
            if (!error) {
                toast.success('Tarea actualizada exitosamente');
            }
        }
    }

    const submitTask = async (data: CreateTaskData, editingTask?: Task | null): Promise<Task> => {
        if (editingTask) {
            return await updateTask({ taskId: editingTask.id, data });
        } else {
            return await createTask(data);
        }
    }

    const duplicateTask = async (task: Task): Promise<Task> => {
        setLoading(true);
        setError(null);

        try {
            console.log('📋 [HOOK] Duplicando tarea...', task);

            // Validate required fields
            if (!task.company?.id || !task.area?.id || !task.user?.id) {
                throw new Error('La tarea no tiene todos los datos necesarios para duplicar');
            }

            // Create a new task with the same data but without the ID
            const duplicateData: CreateTaskData = {
                name: `${task.name} (Copia)`,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate,
                companyId: task.company.id,
                areaId: task.area.id,
                userId: task.user.id,
            };

            const newTask = await createTask(duplicateData);
            console.log('✅ [HOOK] Tarea duplicada:', newTask);

            // Reload tasks if the callback is provided
            if (loadTasks) {
                await loadTasks();
            }

            return newTask;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('💥 [HOOK] Error en duplicateTask:', err);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { 
        createTask, 
        deleteTask, 
        updateTask, 
        submitTask, 
        duplicateTask,
        isDeletingTask: isDeleting 
    };
}