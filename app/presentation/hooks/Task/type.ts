export interface UseTaskResult {
    getAllTasks: () => Promise<Task[]>;
    getTaskById: (taskId: string) => Promise<Task>;
    createTask: (data: CreateTaskData) => Promise<Task>;
    updateTask: (params: { taskId: string; data: UpdateTaskData }) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<any>;
    isLoading: boolean;
    error: string | null;
}
