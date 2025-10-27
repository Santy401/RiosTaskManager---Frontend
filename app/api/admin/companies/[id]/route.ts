import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

interface DecodedToken {
  role?: string;
  userId?: string;
  id?: string;
}

interface CompanyUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  nit?: string;
  state?: boolean;
  updatedAt: Date;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 });
    }

    const { id: companyId } = await params;

    if (!companyId) {
      return NextResponse.json({ error: 'ID de empresa requerido' }, { status: 400 });
    }

    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    if (existingCompany.tipo === 'Sistema' || existingCompany.name === 'Empresa Principal') {
      return NextResponse.json({
        error: 'No se puede eliminar la empresa principal del sistema'
      }, { status: 403 });
    }

    await prisma.company.delete({
      where: { id: companyId },
    });

    console.log(`✅ Empresa ${companyId} eliminada por admin ${decoded.userId || decoded.id}`);

    return NextResponse.json({
      success: true,
      message: 'Empresa eliminada exitosamente',
      deletedCompanyId: companyId
    });

  } catch (error: unknown) {
    console.error('❌ Error en DELETE /api/admin/companies/[id]:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({
          error: 'No se puede eliminar la empresa porque tiene usuarios o datos asociados'
        }, { status: 409 });
      }

      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json({
          error: 'La empresa ya fue eliminada'
        }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 });
    }

    const { id: companyId } = await params;

    if (!companyId) {
      return NextResponse.json({ error: 'ID de empresa requerido' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, phone, address, nit, state } = body;

    if (!name && !email && !phone && !address && !nit && state === undefined) {
      return NextResponse.json({
        error: 'Al menos un campo debe ser actualizado'
      }, { status: 400 });
    }

    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    if (existingCompany.tipo === 'Sistema' || existingCompany.name === 'Empresa Principal') {
      return NextResponse.json({
        error: 'No se puede modificar la empresa principal del sistema'
      }, { status: 403 });
    }

    const updateData: CompanyUpdateData = {
      updatedAt: new Date()
    };
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (nit) updateData.nit = nit;
    if (state !== undefined) updateData.state = state;

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
    });

    console.log(`✅ Empresa ${companyId} actualizada por admin ${decoded.userId || decoded.id}`);

    return NextResponse.json({
      success: true,
      message: 'Empresa actualizada exitosamente',
      company: updatedCompany
    });

  } catch (error: unknown) {
    console.error('❌ Error en PUT /api/admin/companies/[id]:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json({
          error: 'Ya existe una empresa con ese NIT o email'
        }, { status: 409 });
      }

      if (error.message.includes('Record to update not found')) {
        return NextResponse.json({
          error: 'La empresa no existe o ya fue eliminada'
        }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}