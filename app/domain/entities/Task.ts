
interface _Task {
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

interface _CreateTaskData {
    name: string;
    description: string;
    dueDate: Date;
    status: 'pendiente' | 'en_progreso' | 'terminada';
    companyId: string;
    areaId: string;
    userId: string;
}

interface _UpdateTaskData {
    name?: string;
    description?: string;
    dueDate?: Date;
    status?: 'pendiente' | 'en_progreso' | 'terminada';
    companyId?: string;
    areaId?: string;
    userId?: string;
}