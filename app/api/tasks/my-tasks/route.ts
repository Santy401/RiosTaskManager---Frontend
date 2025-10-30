// app/api/tasks/my-tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔐 Verificando token desde cookies...');
    const auth = await verifyToken(req);
    
    if ('error' in auth) {
      console.error('❌ Error de autenticación:', auth.error);
      return NextResponse.json(auth, { status: auth.status });
    }

    console.log('👤 Usuario autenticado:', auth.user.id, auth.user.email);

    const tasks = await prisma.task.findMany({
      where: { 
        userId: auth.user.id
      },
      include: { 
        company: true, 
        area: true
      },
    });

    console.log(`✅ Tareas encontradas: ${tasks.length} para el usuario ${auth.user.id}`);
    
    return NextResponse.json(tasks);
    
  } catch (error) {
    console.error('💥 Error en /api/tasks/my-tasks:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener tareas' }, 
      { status: 500 }
    );
  }
}