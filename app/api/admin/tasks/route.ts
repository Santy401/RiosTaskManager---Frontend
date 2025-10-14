import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { getAllTasks, createTask } from "@/lib/task";

export async function GET(request: Request) {
    try {
        const cookies = request.headers.get('cookie');
        const token = cookies?.match(/token=([^;]+)/)?.[1];
        const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
        const activeToken = token || authToken;

        if (!activeToken) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
        }

        const tasks = await getAllTasks(); // ✅ Cambié 'users' por 'companies'

        return NextResponse.json(tasks);

    } catch (error) {
        console.error('Error en /api/admin/tasks:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
        }

        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookies = request.headers.get('cookie');
        const token = cookies?.match(/token=([^;]+)/)?.[1];
        const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
        const activeToken = token || authToken;

        if (!activeToken) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

        if (decoded.role !== 'admin') {
            return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, companyId, areaId, userId, dueDate, status } = body;

        // ✅ Validaciones básicas
        if (!name || !areaId || !description || !companyId || !userId || !dueDate || !status) {
            return NextResponse.json({ error: 'Los campos son requeridos' }, { status: 400 });
        }

        // ✅ Verificar si ya existe una empresa con el mismo NIT o email
        // const existingCompany = await checkIfCompanyExists(nit, email);
        // if (existingCompany) {
        //   return NextResponse.json({ error: 'Ya existe una empresa con este NIT o email' }, { status: 409 });
        // }

        // ✅ Crear la empresa en la base de datos
        const newTask = await createTask({
            name,
            description,
            companyId,
            areaId,
            userId,
            dueDate,
            status,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('✅ Tarea creada exitosamente:', newTask.id);

        return NextResponse.json({
            success: true,
            message: 'Tarea creada exitosamente',
            Task: newTask
        }, { status: 201 });

    } catch (error) {
        console.error('Error en POST /api/admin/tasks:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
        }

        // Manejar errores de base de datos
        if (error instanceof Error && error.message.includes('unique constraint')) {
            return NextResponse.json({ error: 'Ya existe una tarea con algunos campos' }, { status: 409 });
        }

        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}