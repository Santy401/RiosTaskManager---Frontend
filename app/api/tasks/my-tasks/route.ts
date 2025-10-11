import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if ('error' in auth) {
    return NextResponse.json(auth, { status: auth.status });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: auth.user.id as string },
      include: { company: true, area: true },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tareas' }, { status: 500 });
  }
}
