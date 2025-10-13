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

    const userId = params.id;

    // ✅ Validar que el ID existe
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    // ✅ Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // ✅ Prevenir que un admin se elimine a sí mismo
    if (existingUser.id === decoded.userId || existingUser.id === decoded.id) {
      return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 });
    }

    // ✅ Eliminar el usuario
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log(`✅ Usuario ${userId} eliminado por admin ${decoded.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      deletedUserId: userId
    });

  } catch (error) {
    console.error('❌ Error en DELETE /api/admin/users/[id]:', error);

    // Manejar errores específicos de JWT
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    // Manejar errores de Prisma
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json({ 
        error: 'No se puede eliminar el usuario porque tiene datos asociados' 
      }, { status: 409 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}