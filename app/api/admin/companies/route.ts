import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, requireRole } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if ('error' in auth) {
    return NextResponse.json(auth, { status: auth.status });
  }

  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener empresas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if ('error' in auth) {
    return NextResponse.json(auth, { status: auth.status });
  }

  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  try {
    const data = await req.json();
    const company = await prisma.company.create({ data });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear empresa' }, { status: 500 });
  }
}
