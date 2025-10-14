import { prisma } from "./prisma";

export async function getAllTasks() {
    try {
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                dueDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                // ✅ Incluir las relaciones con los datos necesarios
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                area: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return tasks;
    } catch (error) {
        console.error('Error obteniendo tareas de la DB:', error);
        throw error;
    }
}

export async function createTask(taskData: {
    name: string;
    description: string;
    companyId: string;
    areaId: string;
    userId: string;
    dueDate: Date;
    status: string;
    // ❌ createdAt y updatedAt se generan automáticamente
}) {
    try {
        const newTask = await prisma.task.create({
            data: {
                name: taskData.name,
                description: taskData.description,
                companyId: taskData.companyId,
                areaId: taskData.areaId,
                userId: taskData.userId,
                dueDate: taskData.dueDate,
                status: taskData.status,
                // createdAt y updatedAt se generan automáticamente
            },
            select: {
                id: true,
                name: true,
                description: true,
                dueDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                // ✅ Incluir las relaciones en la respuesta
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                area: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return newTask;
    } catch (error) {
        console.error('Error creando tarea en la DB:', error);
        throw error;
    }
}

// ✅ Función adicional para obtener tarea por ID
export async function getTaskById(taskId: string) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                name: true,
                description: true,
                dueDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                area: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return task;
    } catch (error) {
        console.error('Error obteniendo tarea de la DB:', error);
        throw error;
    }
}

// ✅ Función para actualizar tarea
export async function updateTask(taskId: string, taskData: {
    name?: string;
    description?: string;
    dueDate?: Date;
    status?: string;
    companyId?: string;
    areaId?: string;
    userId?: string;
}) {
    try {
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: taskData,
            select: {
                id: true,
                name: true,
                description: true,
                dueDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                area: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return updatedTask;
    } catch (error) {
        console.error('Error actualizando tarea en la DB:', error);
        throw error;
    }
}

// ✅ Función para eliminar tarea
export async function deleteTask(taskId: string) {
    try {
        const deletedTask = await prisma.task.delete({
            where: { id: taskId }
        });

        return deletedTask;
    } catch (error) {
        console.error('Error eliminando tarea de la DB:', error);
        throw error;
    }
}