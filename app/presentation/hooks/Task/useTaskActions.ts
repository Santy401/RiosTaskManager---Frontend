import { useTaskBase } from "./useTaskBase";

export const useTaskActions = () => {
    const { setLoading, setError } = useTaskBase();

    const createTask = async (data: CreateTaskData): Promise<Task> => {
        setLoading(true);
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
            setLoading(false);
        }
    }

    const deleteTask = async (taskId: string): Promise<any> => {
        setLoading(true);
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
            setLoading(false);
        }
    }

    const updateTask = async (params: { taskId: string; data: UpdateTaskData }): Promise<Task> => {
        setLoading(true);
        setError(null);

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
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const submitTask = async (data: CreateTaskData, editingTask?: Task | null): Promise<Task> => {
        if (editingTask) {
            return await updateTask({ taskId: editingTask.id, data });
        } else {
            return await createTask(data);
        }
    }

    return { createTask, deleteTask, updateTask, submitTask }
}