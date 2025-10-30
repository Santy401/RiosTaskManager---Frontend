import { useTaskBase } from './useTaskBase'
import { Task } from './type';

interface UseTaskQueriesResult {
    getAllTasks: () => Promise<Task[]>;
    getTaskById: (taskId: string) => Promise<Task>;
}

export const useTaskQueries = (): UseTaskQueriesResult => {
    const { setLoading, setError } = useTaskBase();

    const getAllTasks = async (): Promise<Task[]> => {
        setLoading(true);
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
            setLoading(false);
        }
    }

    const getTaskById = async (taskId: string): Promise<Task> => {
        setLoading(true);
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
            setLoading(false);
        }
    }

    return { getAllTasks, getTaskById }
}