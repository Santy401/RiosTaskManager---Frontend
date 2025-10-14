import { prisma } from "./prisma";

export async function getAllArea() {
    try {
        const area = await prisma.area.findMany({
            select: {
                id: true,
                name: true,
                state: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return area;
    } catch (error) {
        console.error('error obtener empresas de la DB:', error)
        throw error;
    }
}

export async function createArea(areaData: {
    name: string;
    state: string;
    createdAt: Date;
    updatedAt: Date;
}) {
    try {
        const newArea = await prisma.area.create({
            data: areaData,
            select: {
                id: true,
                name: true,
                state: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return newArea;
    } catch (error) {
        console.error('Error creando area en la DB:', error);
        throw error;
    }
}