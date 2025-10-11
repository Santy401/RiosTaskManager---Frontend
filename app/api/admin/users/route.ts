// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getRealUsers } from '@/lib/users';

export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const cookies = request.headers.get('cookie');
    const token = cookies?.match(/token=([^;]+)/)?.[1];
    const authToken = cookies?.match(/auth-token=([^;]+)/)?.[1];
    const activeToken = token || authToken;

    if (!activeToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(activeToken, process.env.JWT_SECRET!) as any;

    // Verificar permisos de admin
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos de administrador' }, { status: 403 });
    }

    // Obtener usuarios reales desde la base de datos
    const users = await getRealUsers();

    return NextResponse.json(users);

  } catch (error) {
    console.error('Error en /api/admin/users:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}