import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
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
    console.log("error:", error)
    return NextResponse.json({ error: 'Error al obtener tareas' }, { status: 500 });
  }
}
