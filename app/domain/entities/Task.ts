export interface Task {
    id: string;
    name: string;
    description: string;
    companyId: string;
    areaId: string;
    userId: string;
    dueDate: Date;
    status: string;
}