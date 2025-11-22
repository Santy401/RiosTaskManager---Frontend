import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { env } from './env';

export async function verifyToken(req: NextRequest) {
  // Usar SOLO auth-token
  const token = req.cookies.get('auth-token')?.value;

  console.log('🔐 Cookie auth-token encontrada:', !!token);
  console.log('🔐 Token:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');

  if (!token) {
    return { error: 'No autorizado', status: 401 };
  }

  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userPayload = payload as any;

    if (!userPayload.id || !userPayload.email || !userPayload.role) {
      return { error: 'Token inválido: faltan propiedades', status: 401 };
    }

    console.log('✅ Usuario verificado:', userPayload.email, userPayload.role);
    return {
      user: {
        id: String(userPayload.id),
        email: String(userPayload.email),
        name: userPayload.name ? String(userPayload.name) : undefined,
        role: String(userPayload.role)
      }
    };
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    return { error: 'Token inválido', status: 401 };
  }
}