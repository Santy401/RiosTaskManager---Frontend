import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function verifyToken(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return { error: 'No autorizado', status: 401 };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
    const { payload } = await jwtVerify(token, secret);
    return { user: payload };
  } catch {
    return { error: 'Token inválido', status: 401 };
  }
}

export async function requireRole(role: string) {
  return async (req: NextRequest) => {
    const auth = await verifyToken(req);
    if ('error' in auth) return NextResponse.json(auth, { status: auth.status });

    if (auth.user.role !== role) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    return null;
  };
}
