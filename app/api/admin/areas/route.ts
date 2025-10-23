import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { getAllArea } from "@/lib/area";
import { prisma } from "@/lib/prisma";

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

    const companies = await getAllArea();

    return NextResponse.json(companies);

  } catch (error) {
    console.error('Error en /api/admin/areas:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
    }

    const areaId = params.id;
    const body = await request.json();

    const { name, state } = body;

    if (!name && state === undefined) {
      return NextResponse.json({ error: 'Al menos un campo debe ser actualizado' }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (state !== undefined) updateData.state = state;
    updateData.updatedAt = new Date();

    const updatedArea = await prisma.area.update({
      where: { id: areaId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Área actualizada exitosamente',
      area: updatedArea
    });

  } catch (error) {
    console.error('Error en PUT /api/admin/areas/[id]:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}