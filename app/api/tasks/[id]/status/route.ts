import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

    // Only allow users to update their own tasks
    if (decoded.role !== 'user' && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos para actualizar tareas' }, { status: 403 });
    }

    const taskId = params.id;
    const body = await request.json();
    const { status } = body;

    // Only allow status updates to 'terminada' (completed)
    if (status !== 'terminada') {
      return NextResponse.json({ error: 'Solo puedes marcar tareas como completadas' }, { status: 400 });
    }

    // Check if task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { user: true }
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    // If user is not admin, ensure they can only update their own tasks
    if (decoded.role !== 'admin' && existingTask.userId !== decoded.id) {
      return NextResponse.json({ error: 'No puedes actualizar tareas que no te pertenecen' }, { status: 403 });
    }

    // Update only the status field
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: 'terminada' },
      include: { company: true, area: true, user: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Tarea marcada como completada',
      task: updatedTask
    });

  } catch (error) {
    console.error('Error en PUT /api/tasks/[id]/status:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
