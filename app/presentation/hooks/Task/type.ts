export interface Task {
    id: string;
    name: string;
    description: string;
    status: string;
    dueDate: Date;
    companyId: string;
    areaId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskData {
    name: string;
    description: string;
    status: string;
    dueDate: Date;
    companyId: string;
    areaId: string;
    userId: string;
}

export interface UpdateTaskData {
    name?: string;
    description?: string;
    status?: string;
    dueDate?: Date;
    companyId?: string;
    areaId?: string;
    userId?: string;
}

export interface DeleteTaskResponse {
    success: boolean;
    message: string;
    deletedTaskId: string;
}

export interface UseTaskResult {
    getAllTasks: () => Promise<Task[]>;
    getTaskById: (taskId: string) => Promise<Task>;
    createTask: (data: CreateTaskData) => Promise<Task>;
    updateTask: (params: { taskId: string; data: UpdateTaskData }) => Promise<Task>;
    deleteTask: (taskId: string) => Promise<DeleteTaskResponse>;
    isDeletingTask: (taskId: string) => boolean;
    isLoading: boolean;
    error: string | null;
}