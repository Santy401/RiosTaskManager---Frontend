import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Verificar autenticación
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // ✅ Verificar token JWT
    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

    // ✅ Verificar permisos de administrador
    if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 });
    }

    const companyId = params.id;

    // ✅ Validar que el ID existe
    if (!companyId) {
      return NextResponse.json({ error: 'ID de empresa requerido' }, { status: 400 });
    }

    // ✅ Verificar que la empresa existe
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    // ✅ Prevenir eliminación de empresa esencial (opcional)
    if (existingCompany.tipo === 'Sistema' || existingCompany.name === 'Empresa Principal') {
      return NextResponse.json({ 
        error: 'No se puede eliminar la empresa principal del sistema' 
      }, { status: 403 });
    }

    // ✅ Eliminar la empresa
    await prisma.company.delete({
      where: { id: companyId },
    });

    console.log(`✅ Empresa ${companyId} eliminada por admin ${decoded.userId || decoded.id}`);

    return NextResponse.json({
      success: true,
      message: 'Empresa eliminada exitosamente',
      deletedCompanyId: companyId
    });

  } catch (error) {
    console.error('❌ Error en DELETE /api/admin/companies/[id]:', error);

    // Manejar errores específicos de JWT
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    // Manejar errores de Prisma
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